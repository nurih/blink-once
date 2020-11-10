output "deployment_location" {
  value = azurerm_resource_group.group.location
}

output "deployment_resource_group" {
  value = azurerm_resource_group.group.name
}

output "endpoints" {
  description = "Endpoints created by this deployment"
  value = [
    "https://${azurerm_function_app.func.default_hostname}/UI/",
    "https://${azurerm_function_app.func.default_hostname}/api/Remember",
    "https://${azurerm_function_app.func.default_hostname}/api/Consume",
  ]
}
