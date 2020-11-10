variable "name" {
  type        = string
  description = "Name of the application. The name would be used as a basis for all resource naming"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]+[a-z0-9]$", var.name))
    error_message = "The name should be all lower case, alpha and digits."
  }
}

variable "blob_ttl" {
  type        = number
  description = "TTL of blinky in days (default: 3)"
  default     = 3
}

variable "instance" {
  type        = string
  description = "Instance identifier. Appended to name to create unique deployments (default: random animal name)"
  default     = ""
}

variable "location" {
  type        = string
  description = "Azure region. (default: westus)"
  default     = "westus"
}
