# Stage 1: Build
FROM python:3.9-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache gcc musl-dev libffi-dev

# Create virtual environment
RUN python3 -m venv venv
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Run
FROM python:3.9-alpine AS runner

WORKDIR /app

# Copy virtual environment from builder stage
COPY --from=builder /app/venv venv

# Copy application code
COPY app.py app.py

# Use a non-root user for security
RUN adduser -D myuser
USER myuser

ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
ENV FLASK_APP=app/app.py

EXPOSE 8080

CMD ["gunicorn", "--bind", ":8080", "--workers", "2", "app:app"]