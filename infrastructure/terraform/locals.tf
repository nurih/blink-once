resource "random_pet" "rnd" {
  length    = 1
  separator = ""
  keepers = {
    location = var.location
    name     = var.name
  }
}

locals {
  instance      = var.instance == "" ? random_pet.rnd.id : var.instance
  iid           = lower(replace("${var.name}-${local.instance}-${local.location_abbr}", "/[^a-zA-Z0-9]/g", ""))
  rg            = "${local.iid}-rg"
  location_abbr = local._az_location_map[local.location]
  location      = var.location
  blob_account  = replace(local.iid, "/[^a-z0-9]/", "")
  asp           = "${local.iid}-asp"
  ttl           = var.blob_ttl
  pep           = "${local.iid}-pep"
  fa            = "${local.iid}-fa"
}

locals {
  _az_location_map = {
    "australiacentral" : "auc",
    "australiacentral2" : "auc2",
    "australiaeast" : "aue",
    "australiasoutheast" : "ause",
    "brazilsouth" : "brs",
    "brazilsoutheast" : "brse",
    "canadacentral" : "cac",
    "canadaeast" : "cae",
    "centralindia" : "inc",
    "centralus" : "ce",
    "eastasia" : "ase",
    "eastus" : "use",
    "eastus2" : "use2",
    "francecentral" : "frc",
    "francesouth" : "frs",
    "germanynorth" : "den",
    "germanywestcentral" : "dewc",
    "japaneast" : "jpe",
    "japanwest" : "jpw",
    "koreacentral" : "koc",
    "koreasouth" : "kos",
    "northcentralus" : "usnc",
    "northeurope" : "eun",
    "norwayeast" : "noe",
    "norwaywest" : "now",
    "southafricanorth" : "san",
    "southafricawest" : "saw",
    "southcentralus" : "ussc",
    "southeastasia" : "asse",
    "southindia" : "ins",
    "switzerlandnorth" : "cnn",
    "switzerlandwest" : "cnw",
    "uaecentral" : "ua",
    "uaenorth" : "uan",
    "uksouth" : "uks",
    "ukwest" : "ukw",
    "westcentralus" : "uswc",
    "westeurope" : "euw",
    "westindia" : "inw",
    "westus" : "usw",
    "westus2" : "usw2"
  }
}
