{{/*
Users API
*/}}
{{- define "users.name" -}}
{{- printf "%s-%s" .Release.Name "users" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "users.deploy" -}}
{{- printf "%s-%s-%s"  .Release.Name "users" "deploy" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "users.service" -}}
{{- printf "%s-%s-%s"  .Release.Name "users" "service" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "users.port" -}}
{{- printf "%s-%s-%s"  .Release.Name "users" "port" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
MySQL
*/}}
{{- define "mysql.service" -}}
{{- if .Values.mysql.create }}
{{- printf "%s-%s-%s" .Release.Name "mysql" "service" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s" .Values.mysql.host }}
{{- end }}
{{- end }}

{{- define "mysql.name" -}}
{{- printf "%s-%s" .Release.Name "mysql" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mysql.deploy" -}}
{{- printf "%s-%s-%s" .Release.Name "mysql" "deploy" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mysql.pvc" -}}
{{- printf "%s-%s-%s" .Values.namespace "mysql" "pvc" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "mysql.port" -}}
{{- printf "%s-%s-%s" .Release.Name "mysql" "port" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Secrets
*/}}
{{- define "user.secrets" -}}
{{- printf "%s-%s-%s" .Release.Name "users" "secrets" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Ingress
*/}}
{{- define "ingress.name" -}}
{{- printf "%s-%s" .Release.Name "ingress" | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}