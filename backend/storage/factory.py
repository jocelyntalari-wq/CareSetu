"""
CareSetu Storage Repository Factory
Instantiates SupabaseRepository if valid credentials exist in .env;
otherwise cleanly falls back to SQLiteRepository with private local file storage.
"""

import os
from dotenv import load_dotenv
from storage.base_repository import BaseStorageRepository
from storage.sqlite_repository import SQLiteRepository
from storage.supabase_repository import SupabaseRepository

load_dotenv()

_repository_instance: BaseStorageRepository = None

def get_storage_repository() -> BaseStorageRepository:
    global _repository_instance
    if _repository_instance is not None:
        return _repository_instance

    backend_type = os.getenv("STORAGE_BACKEND", "sqlite").lower()
    supabase_url = os.getenv("SUPABASE_URL", "").strip()
    supabase_key = os.getenv("SUPABASE_KEY", "").strip()
    supabase_bucket = os.getenv("SUPABASE_BUCKET", "care_documents").strip()

    if backend_type == "supabase" and supabase_url and supabase_key:
        print(f"[CareSetu Storage] Activating Supabase repository at {supabase_url}")
        _repository_instance = SupabaseRepository(supabase_url, supabase_key, supabase_bucket)
    else:
        print("[CareSetu Storage] Using SQLite repository with local private file storage (Zero external credentials required).")
        _repository_instance = SQLiteRepository()

    return _repository_instance
