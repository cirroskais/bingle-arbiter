local jobId, type, baseUrl, placeId, port, key = ...

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

local scriptContext = game:GetService('ScriptContext')
pcall(function() scriptContext:AddStarterScript(37801172) end)

game:SetPlaceID(assetId, false)
game:GetService("ChangeHistoryService"):SetEnabled(false)

local ns = game:GetService("NetworkServer")

if baseUrl ~= nil then
	pcall(function() game:GetService("Players"):SetAbuseReportUrl(baseUrl .. "/AbuseReport/InGameChatHandler.ashx") end)
	pcall(function() game:GetService("ScriptInformationProvider"):SetAssetUrl(baseUrl .. "/Asset/") end)
	pcall(function() game:GetService("ContentProvider"):SetBaseUrl(baseUrl .. "/") end)

	game:GetService("BadgeService"):SetPlaceId(placeId)

    game:GetService("BadgeService"):SetAwardBadgeUrl(baseUrl .. "/assets/award-badge?userId=%d&badgeId=%d&placeId=%d")
    game:GetService("BadgeService"):SetHasBadgeUrl(baseUrl .. "/Game/Badge/HasBadge.ashx?UserID=%d&BadgeID=%d")
    game:GetService("BadgeService"):SetIsBadgeDisabledUrl(baseUrl .. "/Game/Badge/IsBadgeDisabled.ashx?BadgeID=%d&PlaceID=%d")
    game:GetService("BadgeService"):SetIsBadgeLegalUrl("")
	game:GetService("InsertService"):SetBaseSetsUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?nsets=10&type=base")
	game:GetService("InsertService"):SetUserSetsUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?nsets=20&type=user&userid=%d")
	game:GetService("InsertService"):SetCollectionUrl(baseUrl .. "/Game/Tools/InsertAsset.ashx?sid=%d")
	game:GetService("InsertService"):SetAssetUrl(baseUrl .. "/Asset/?id=%d")
	game:GetService("InsertService"):SetAssetVersionUrl(baseUrl .. "/Asset/?assetversionid=%d")

	pcall(function() loadfile(baseUrl .. "/Game/LoadPlaceInfo.ashx?PlaceId=" .. placeId)() end)
end

pcall(function() game:GetService("NetworkServer"):SetIsPlayerAuthenticationRequired(true) end)

settings().Diagnostics.LuaRamLimit = 0

game:GetService("Players").PlayerAdded:connect(function(player)
	print("Player " .. player.userId .. " added")
end)

game:GetService("Players").PlayerRemoving:connect(function(player)
	print("Player " .. player.userId .. " leaving")
end)

if placeId~=nil and baseUrl~=nil then
	wait()
	game:Load("https://kapish.fun/asset/?id=" .. placeId .. "&placelol=true&key=" .. key)
end

-- Now start the connection

ns:Start(port)

spawn(function()
	while wait(5) do
		local playerIds = ""
		local players = game.Players:GetChildren()
		for i, player in pairs(players) do
			if player.ClassName == "Player" then
				if i ~= #players then
					playerIds = playerIds .. player.userId .. ","
				else
					playerIds = playerIds .. player.userId
				end
			end
		end

		pcall(function() game:HttpGet('http://kapish.fun/server/ping/' .. placeId .. '?players=' .. playerIds .. "&key=" .. key) end)
	end
end)

spawn(function()
	while wait(60) do
		if #game.Players:GetPlayers() == 0 then
			pcall(function() game:HttpGet("https://kapish.fun/dielol/" .. placeId.."?key=" .. key) end)
		else 
			pcall(function() game:HttpGet("https://kapish.fun/renewlol/" .. placeId.."?key=" .. key) end)
		end
	end
end)

------------------------------END START GAME SHARED SCRIPT--------------------------

game:GetService("RunService"):Run()
