local jobId, type, format, x, y, baseUrl, assetId, mannequin = ...

print(("[%s] Started RenderJob for type '%s' with assetId %d ..."):format(jobId, type, assetId))

game:GetService("ScriptInformationProvider"):SetAssetUrl(baseUrl .. "/asset/")
game:GetService("InsertService"):SetAssetUrl(baseUrl .. "/asset/?id=%d")
game:GetService("InsertService"):SetAssetVersionUrl(baseUrl .. "/Asset/?assetversionid=%d")
game:GetService("ContentProvider"):SetBaseUrl(baseUrl)
game:GetService("ScriptContext").ScriptsDisabled = true

if mannequin then
    local Player = game.Players:CreateLocalPlayer(0)
    Player.CharacterAppearance = ("%s/v1.1/asset-render/%d"):format(baseUrl, assetId)
    Player:LoadCharacter(false)
else
    local asset = game:GetObjects(("%s/Asset/?id=%d"):format(baseUrl, assetId))[1]
    asset.Parent = workspace

    local thumbnailCamera = asset:FindFirstChild("ThumbnailCamera")
    if thumbnailCamera ~= nil and thumbnailCamera.ClassName == "Camera" then
        workspace.CurrentCamera = thumbnailCamera
    end
end

print(("[%s] Rendering ..."):format(jobId))
local result = game:GetService("ThumbnailGenerator"):Click(format, x, y, true)
print(("[%s] Done!"):format(jobId))

return result