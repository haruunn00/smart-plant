FROM python:3.11-slim

WORKDIR /app

# Instaliraj dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Kopiraj aplikaciju
COPY ./app ./app

# Postavi environment varijable
ENV PYTHONUNBUFFERED=1

# Expozaj port
EXPOSE 8000

# Pokreni aplikaciju
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
