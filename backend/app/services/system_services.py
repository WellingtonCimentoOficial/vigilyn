import psutil
from app.models.setting_models import Setting
from datetime import datetime, timezone


def get_ram():
    memory = psutil.virtual_memory()
    total = round(memory.total / (1024**3), 2)
    used = round(memory.used / (1024**3), 2)
    free = round(memory.free / (1024**3), 2)
    percent_used = round((used / total) * 100, 2)

    data = {"total": total, "used": used, "free": free, "percent_used": percent_used}

    return data


def get_cpu():
    cores = psutil.cpu_count(logical=False)
    threads = psutil.cpu_count(logical=True)
    percent_used = psutil.cpu_percent(interval=1)

    data = {"cores": cores, "threads": threads, "percent_used": percent_used}

    return data


def get_storage():
    save_directory_path = Setting.query.first().save_directory_path

    storage = psutil.disk_usage(save_directory_path)
    total = round(storage.total / (1024**3), 2)
    used = round(storage.used / (1024**3), 2)
    free = round(storage.free / (1024**3), 2)
    percent_used = round((used / total) * 100, 2)

    data = {"total": total, "used": used, "free": free, "percent_used": percent_used}

    return data


def get_system():
    cpu = get_cpu()
    ram = get_ram()
    storage = get_storage()
    time = datetime.now().replace(tzinfo=timezone.utc).isoformat()

    data = {"cpu": cpu, "ram": ram, "storage": storage, "time": time}

    return data
