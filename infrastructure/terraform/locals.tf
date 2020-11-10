resource "random_pet" "rnd" {
  length = 1
  separator = ""
  keepers = {
    location = var.location
    name     = var.name
  }
}

locals {
  instance     = var.instance == "" ? random_pet.rnd.id : var.instance
  iid          = lower(replace("${var.name}${local.instance}","/[^a-zA-Z0-9]/g", ""))
  rg           = "${local.iid}-rg"
  location     = var.location
  blob_account = replace("${local.iid}${local.location}", "[^a-z0-9]", "")
  asp          = "${local.iid}-asp"
  ttl          = var.blob_ttl
  pep          = "${local.iid}-pep"
  fa           = "${local.iid}-fa"
}
