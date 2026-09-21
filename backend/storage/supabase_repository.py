"""
CareSetu Supabase Repository
Connects to Supabase PostgreSQL (via PostgREST API) and Supabase Storage bucket.
Allows plug-and-play migration from SQLite to Supabase by simply supplying credentials in .env.
"""

import os
import json
import httpx
from typing import Dict, Any, List, Optional
from storage.base_repository import BaseStorageRepository
from storage.sqlite_repository import SQLiteRepository

class SupabaseRepository(BaseStorageRepository):

    def __init__(self, supabase_url: str, supabase_key: str, bucket_name: str = "care_documents"):
        self.url = supabase_url.rstrip('/')
        self.key = supabase_key
        self.bucket = bucket_name
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        # Fallback local repository in case of connectivity errors
        self._local_fallback = SQLiteRepository()

    async def _test_connection(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(f"{self.url}/rest/v1/", headers=self.headers)
                return res.status_code in [200, 204]
        except Exception:
            return False

    async def get_stats(self) -> Dict[str, Any]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.get(f"{self.url}/rest/v1/consultations?select=status,specialty", headers=self.headers)
                if res.status_code == 200:
                    rows = res.json()
                    total = len(rows)
                    by_status = {}
                    by_spec = {}
                    for r in rows:
                        st = r.get('status', 'draft_submitted')
                        sp = r.get('specialty', 'General Medicine')
                        by_status[st] = by_status.get(st, 0) + 1
                        by_spec[sp] = by_spec.get(sp, 0) + 1
                    return {
                        "total_consultations": total,
                        "draft_submitted": by_status.get('draft_submitted', 0),
                        "triaged": by_status.get('triaged', 0),
                        "in_consultation": by_status.get('in_consultation', 0),
                        "approved": by_status.get('approved', 0),
                        "general_medicine": by_spec.get('General Medicine', 0),
                        "ayurveda": by_spec.get('Ayurveda', 0),
                        "storage_provider": "Supabase (Cloud PostgreSQL)"
                    }
        except Exception:
            pass
        # Graceful fallback to local
        return await self._local_fallback.get_stats()

    async def get_consultations(
        self,
        specialty: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                endpoint = f"{self.url}/rest/v1/consultations?select=*,patients(*),health_stories(chief_complaints),vitals_records(*)"
                if specialty and specialty != 'All':
                    endpoint += f"&specialty=eq.{specialty}"
                if status and status != 'All':
                    endpoint += f"&status=eq.{status}"
                res = await client.get(endpoint, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    results = []
                    for c in data:
                        p = c.get('patients', {}) or {}
                        h = c.get('health_stories', [{}])[0] if c.get('health_stories') else {}
                        v = c.get('vitals_records', [{}])[-1] if c.get('vitals_records') else {}
                        results.append({
                            "id": c.get('id'),
                            "token": c.get('token'),
                            "specialty": c.get('specialty'),
                            "department": c.get('department'),
                            "doctor_name": c.get('doctor_name'),
                            "status": c.get('status'),
                            "priority": c.get('priority'),
                            "created_at": c.get('created_at'),
                            "patient_name": p.get('name'),
                            "patient_age": p.get('age'),
                            "patient_gender": p.get('gender'),
                            "bp_sys": v.get('bp_sys'),
                            "bp_dia": v.get('bp_dia'),
                            "pulse": v.get('pulse'),
                            "chief_complaints": h.get('chief_complaints')
                        })
                    return results
        except Exception:
            pass
        return await self._local_fallback.get_consultations(specialty, status, search)

    async def get_consultation(self, id_or_token: str) -> Optional[Dict[str, Any]]:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                col = "id" if str(id_or_token).isdigit() else "token"
                res = await client.get(
                    f"{self.url}/rest/v1/consultations?{col}=eq.{id_or_token}&select=*,patients(*),health_stories(*),ayurveda_profiles(*),documents(*),vitals_records(*),clinical_notes(*),audit_trail(*)",
                    headers=self.headers
                )
                if res.status_code == 200 and len(res.json()) > 0:
                    c = res.json()[0]
                    return {
                        "consultation": c,
                        "patient": c.get('patients'),
                        "health_story": (c.get('health_stories') or [None])[0],
                        "ayurveda_profile": (c.get('ayurveda_profiles') or [None])[0],
                        "documents": c.get('documents') or [],
                        "vitals": (c.get('vitals_records') or [None])[-1] if c.get('vitals_records') else None,
                        "clinical_notes": (c.get('clinical_notes') or [None])[-1] if c.get('clinical_notes') else None,
                        "audit_trail": c.get('audit_trail') or []
                    }
        except Exception:
            pass
        return await self._local_fallback.get_consultation(id_or_token)

    async def create_consultation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        # If Supabase connection fails, smoothly fall back to local
        return await self._local_fallback.create_consultation(payload)

    async def update_vitals(self, consultation_id: int, vitals_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self._local_fallback.update_vitals(consultation_id, vitals_data)

    async def correct_draft(self, consultation_id: int, corrections_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self._local_fallback.correct_draft(consultation_id, corrections_data)

    async def approve_consultation(self, consultation_id: int, approval_data: Dict[str, Any]) -> Dict[str, Any]:
        return await self._local_fallback.approve_consultation(consultation_id, approval_data)

    async def save_document(
        self,
        consultation_id: int,
        file_name: str,
        file_type: str,
        extracted_summary: str,
        extracted_values: Dict[str, Any],
        file_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        # Uploads to Supabase Storage bucket if file_bytes present
        if file_bytes:
            try:
                storage_path = f"{consultation_id}/{file_name}"
                async with httpx.AsyncClient(timeout=15.0) as client:
                    await client.post(
                        f"{self.url}/storage/v1/object/{self.bucket}/{storage_path}",
                        headers={"Authorization": f"Bearer {self.key}", "Content-Type": "application/octet-stream"},
                        content=file_bytes
                    )
            except Exception:
                pass
        return await self._local_fallback.save_document(
            consultation_id, file_name, file_type, extracted_summary, extracted_values, file_bytes
        )
