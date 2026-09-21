"""
CareSetu Abstract Storage Repository Interface
Defines the persistence contract for both Supabase (PostgreSQL + S3 Storage)
and SQLite (Local Relational + Private File Storage).
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class BaseStorageRepository(ABC):

    @abstractmethod
    async def get_stats(self) -> Dict[str, Any]:
        """Returns overall OPD consultation stats by status and specialty."""
        pass

    @abstractmethod
    async def get_consultations(
        self,
        specialty: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves consultation list with patient summary and vitals."""
        pass

    @abstractmethod
    async def get_consultation(self, id_or_token: str) -> Optional[Dict[str, Any]]:
        """Retrieves single consultation with full nested records (patient, story, dosha, vitals, docs, clinical notes, audit)."""
        pass

    @abstractmethod
    async def create_consultation(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Creates a new patient, consultation, health story draft, and documents."""
        pass

    @abstractmethod
    async def update_vitals(self, consultation_id: int, vitals_data: Dict[str, Any]) -> Dict[str, Any]:
        """Nurse logs triage vitals and updates priority and consultation status."""
        pass

    @abstractmethod
    async def correct_draft(self, consultation_id: int, corrections_data: Dict[str, Any]) -> Dict[str, Any]:
        """Doctor corrects/refines draft history and records clinical observations."""
        pass

    @abstractmethod
    async def approve_consultation(self, consultation_id: int, approval_data: Dict[str, Any]) -> Dict[str, Any]:
        """Doctor establishes final diagnosis, prescriptions, and signs the consultation note."""
        pass

    @abstractmethod
    async def save_document(
        self,
        consultation_id: int,
        file_name: str,
        file_type: str,
        extracted_summary: str,
        extracted_values: Dict[str, Any],
        file_bytes: Optional[bytes] = None
    ) -> Dict[str, Any]:
        """Stores a medical document record and persists the file content."""
        pass
