rg=...
account=...
policy=expire-blob-policy.json

# az storage account management-policy show --account-name $account --resource-group $rg --out yaml

az storage account management-policy create --account-name $account --resource-group $rg --policy $policy --out yaml
