local jobId, type, baseUrl, placeId, port, owner = ...

------------------- UTILITY FUNCTIONS --------------------------

function waitForChild(parent, childName)
    while true do
        local child = parent:findFirstChild(childName)
        if child then
            return child
        end
        parent.ChildAdded:wait()
    end
end

function update(LeavingPlayer)
    local names = {}
    for _, player in pairs(game:GetService("Players"):GetPlayers()) do
        if (player ~= LeavingPlayer) then
            table.insert(names, player.Name)
        end
    end

    local str = (#names > 0) and (#names > 1) and (names[1] .. ",") or names[1] or ""

    for i = 2, #names -1, 1 do
        str = str .. names[i] .. ","
    end

    str = (#names > 0) and (#names > 1) and (str .. names[#names]) or names[1] or ""
    return str
end

function keepAlive(LeavingPlayer)
    game:GetService("HttpService"):PostAsync(baseUrl .. "/API/KeepAlive", game:GetService("HttpService"):JSONEncode({
        ["ServerIP"] = jobId,
        ["PlaceId"] = game.PlaceId,
        ["PlayerCount"] = #game:GetService("Players"):GetPlayers(),
        ["PlayerList"] = update(LeavingPlayer),
    }))
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

local assetId = placeId

local scriptContext = game:GetService("ScriptContext")
pcall(function() scriptContext:AddStarterScript(37801172) end)
scriptContext.ScriptsDisabled = true

game:SetPlaceID(assetId, false)
game:GetService("ChangeHistoryService"):SetEnabled(false)
game:SetCreatorId(owner, Enum.CreatorType.User)
game:GetService("HttpService").HttpEnabled = true

local ns = game:GetService("NetworkServer")

if baseUrl~=nil then
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
end

settings().Diagnostics.LuaRamLimit = 0

game:GetService("Players").PlayerAdded:connect(function(player)
    keepAlive()
    print("Player " .. player.userId .. " added")

    player.CharacterAdded:connect(function(c)
        game:GetObjects("rbxasset://fonts/characterCameraScript.rbxmx")[1].Parent = c
        game:GetObjects("rbxasset://fonts/characterControlScript.rbxmx")[1].Parent = c

        for i,v in pairs(c:GetChildren()) do
            print(v.Name)
        end

        print(c.Animate.Source)
    end)
end)

game:GetService("Players").PlayerRemoving:connect(function(player)
    keepAlive(player)
    print("Player " .. player.userId .. " leaving")
end)

if placeId~=nil and baseUrl~=nil then
    wait()
    game:Load(baseUrl .. "/thumbs/staticimage?r=" .. jobId)
end

------------------------------ RENEW GAME JOB SERVICE -------------------------------

coroutine.resume(coroutine.create((function()
    while wait(30) do
        if #game.Players:GetPlayers() == 0 then
            pcall(function() game:HttpGet(baseUrl .. "/arbiter/" .. jobId .. "/kill") end)
        else
            pcall(function() game:HttpGet(baseUrl .. "/arbiter/" .. jobId .. "/renew?s=360") end)
            keepAlive()
        end
    end
end)))

------------------------------END START GAME SHARED SCRIPT--------------------------

ns:Start(port)

scriptContext:SetTimeout(10)
scriptContext.ScriptsDisabled = false

game:GetService("RunService"):Run()
