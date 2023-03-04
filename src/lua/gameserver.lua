local jobId, type, baseUrl, placeId, port = ...

------------------- UTILITY FUNCTIONS --------------------------
function waitForChild(parent, childName)
    while true do
        local child = parent:findFirstChild(childName)
        if child then return child end
        parent.ChildAdded:wait()
    end
end

-----------------------------------END UTILITY FUNCTIONS -------------------------

-----------------------------------"CUSTOM" SHARED CODE----------------------------------

pcall(function() settings().Network.UseInstancePacketCache = true end)
pcall(function() settings().Network.UsePhysicsPacketCache = true end)
pcall(function() settings()["Task Scheduler"].PriorityMethod = Enum.PriorityMethod.AccumulatedError end)

settings().Network.PhysicsSend = Enum.PhysicsSendMethod.TopNErrors
settings().Network.ExperimentalPhysicsEnabled = true
settings().Network.WaitingForCharacterLogRate = 100
pcall(function() settings().Diagnostics:LegacyScriptMode() end)

-----------------------------------START GAME SHARED SCRIPT------------------------------

local scriptContext = game:GetService("ScriptContext")
pcall(function() scriptContext:AddStarterScript(37801172) end)
scriptContext.ScriptsDisabled = true

game:SetPlaceID(placeId, false)
game:GetService("ChangeHistoryService"):SetEnabled(false)

local ns = game:GetService("NetworkServer")

if baseUrl ~= nil then
    pcall(function() game:GetService("Players"):SetAbuseReportUrl(baseUrl .. "/AbuseReport/InGameChatHandler.ashx") end)
    pcall(function() game:GetService("ScriptInformationProvider"):SetAssetUrl(baseUrl .. "/Asset/") end)
    pcall(function() game:GetService("ContentProvider"):SetBaseUrl(baseUrl .. "/") end)
    pcall(function() game:GetService("Players"):SetChatFilterUrl(baseUrl .. "/Game/ChatFilter.ashx") end)

    game:GetService("BadgeService"):SetPlaceId(placeId)
    game:GetService("BadgeService"):SetIsBadgeLegalUrl("")
    game:GetService("InsertService"):SetBaseSetsUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?nsets=10&type=base")
    game:GetService("InsertService"):SetUserSetsUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d")
    game:GetService("InsertService"):SetCollectionUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?sid=%d")
    game:GetService("InsertService"):SetAssetUrl(baseUrl .. "/Asset/?id=%d")
    game:GetService("InsertService"):SetAssetVersionUrl(baseUrl .. "/Asset/?assetversionid=%d")

    pcall(function() loadfile(baseUrl .. "/Game/LoadPlaceInfo.ashx?PlaceId=" .. placeId)() end)
    pcall(function() game:GetService("NetworkServer"):SetIsPlayerAuthenticationRequired(true) end)
end

settings().Diagnostics.LuaRamLimit = 0

game:GetService("Players").PlayerAdded:connect(function(player)
    print("Player " .. player.userId .. " added")
end)

game:GetService("Players").PlayerRemoving:connect(function(player)
    print("Player " .. player.userId .. " leaving")
end)

if placeId ~= nil and baseUrl ~= nil then
    wait()
    game:Load(baseUrl .. "/asset/?id=" .. placeId)
end

ns:Start(port)

scriptContext:SetTimeout(10)
scriptContext.ScriptsDisabled = false

------------------------------END START GAME SHARED SCRIPT--------------------------

game:GetService("RunService"):Run()
