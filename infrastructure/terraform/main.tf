provider "azurerm" {
  version = "~>2.0"
  features {}
}

resource "azurerm_resource_group" "group" {
  name     = local.rg
  location = local.location
}

resource "azurerm_storage_account" "storage" {
  name                     = local.blob_account
  resource_group_name      = azurerm_resource_group.group.name
  location                 = azurerm_resource_group.group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  access_tier              = "Hot"
  min_tls_version          = "TLS1_2"
}

resource "azurerm_storage_container" "container" {
  name                  = "blink-once"
  storage_account_name  = azurerm_storage_account.storage.name
  container_access_type = "private"
}

resource "azurerm_storage_management_policy" "policy" {
  storage_account_id = azurerm_storage_account.storage.id

  rule {
    name    = "expireBlobRule"
    enabled = true
    filters {
      prefix_match = ["${azurerm_storage_container.container.name}/"]
      blob_types   = ["blockBlob"]
    }
    actions {
      base_blob {
        delete_after_days_since_modification_greater_than = var.blob_ttl
      }
    }
  }
}

resource "azurerm_app_service_plan" "asp" {
  name                = local.asp
  location            = azurerm_resource_group.group.location
  resource_group_name = azurerm_resource_group.group.name
  kind                = "FunctionApp"
  sku {
    tier = "Dynamic"
    size = "Y1"
  }
}

resource "azurerm_function_app" "func" {
  name                = local.fa
  location            = local.location
  resource_group_name = local.rg
  app_service_plan_id = azurerm_app_service_plan.asp.id

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  version                    = "~2"

  app_settings = {
    https_only                      = true
    FUNCTIONS_WORKER_RUNTIME        = "node"
    WEBSITE_NODE_DEFAULT_VERSION    = "~12"
    AZURE_STORAGE_CONNECTION_STRING = azurerm_storage_account.storage.primary_connection_string
  }

  site_config {
    cors {
      allowed_origins = ["*"]
    }
  }

  source_control {
    repo_url           = "https://github.com/nurih/blink-once"
    branch             = "master"
    manual_integration = true
  }
}

