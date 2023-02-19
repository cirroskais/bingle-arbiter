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
--pcall(function() settings()["Task Scheduler"].PriorityMethod = Enum.PriorityMethod.FIFO end)
pcall(function() settings()["Task Scheduler"].PriorityMethod = Enum.PriorityMethod.AccumulatedError end)

--settings().Network.PhysicsSend = 1 -- 1==RoundRobin
--settings().Network.PhysicsSend = Enum.PhysicsSendMethod.ErrorComputation2
settings().Network.PhysicsSend = Enum.PhysicsSendMethod.TopNErrors
settings().Network.ExperimentalPhysicsEnabled = true
settings().Network.WaitingForCharacterLogRate = 100
pcall(function() settings().Diagnostics:LegacyScriptMode() end)

-----------------------------------START GAME SHARED SCRIPT------------------------------

local assetId = placeId -- might be able to remove this now
local UserInputService = game:GetService('UserInputService')

local scriptContext = game:GetService('ScriptContext')
pcall(function() scriptContext:AddStarterScript(37801172) end)
scriptContext.ScriptsDisabled = true

game:SetPlaceID(placeId, false)
game:GetService("ChangeHistoryService"):SetEnabled(false)

-- establish this peer as the Server
local ns = game:GetService("NetworkServer")
local url = "http://www.kapish.fun"
if url~=nil then
print(baseUrl)
	pcall(function() game:GetService("Players"):SetAbuseReportUrl(baseUrl .. "/AbuseReport/InGameChatHandler.ashx") end)
	pcall(function() game:GetService("ScriptInformationProvider"):SetAssetUrl(baseUrl .. "/Asset/") end)
	pcall(function() game:GetService("ContentProvider"):SetBaseUrl(baseUrl .. "/") end)
--	pcall(function() game:GetService("Players"):SetChatFilterUrl(baseUrl .. "/Game/ChatFilter.ashx") end)

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
	
	-- pcall(function() 
	--			if access then
	--				loadfile(baseUrl .. "/Game/PlaceSpecificScript.ashx?PlaceId=" .. placeId .. "&" .. access)()
	--			end
	--		end)
end

pcall(function() game:GetService("NetworkServer"):SetIsPlayerAuthenticationRequired(false) end)
settings().Diagnostics.LuaRamLimit = 0
--settings().Network:SetThroughputSensitivity(0.08, 0.01)
--settings().Network.SendRate = 35
--settings().Network.PhysicsSend = 0  -- 1==RoundRobin


--game:GetService("Players").PlayerAdded:connect(function(player)
--	player:LoadCharacter()
--	print("Player " .. player.userId .. " added")
--end)

game:GetService("Players").PlayerRemoving:connect(function(player)
	print("Player " .. player.userId .. " leaving")
end)

if placeId~=nil and baseUrl~=nil then
	-- yield so that file load happens in the heartbeat thread
	wait()
	
	-- load the game
	game:Load("https://kapish.fun/asset/?id=" .. placeId .. "&placelol=true&key=" .. key)
end

-- Now start the connection
ns:Start(port)


scriptContext:SetTimeout(10)
scriptContext.ScriptsDisabled = false
local success, error = pcall(function()
		while true do
			-- UGLY HACK BECAUSE FOR SOME REASON HTTPPOST AND POSTASYNC CRASHES??
			-- WHAT THE FUCK?
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
			
			game:HttpGet('http://kapish.fun/server/ping/' .. placeId .. '?players=' .. playerIds .. "&key=" .. key)
	
			wait(5)
		end
	end)
spawn(function()
    while true do
	wait(10)
        if #game.Players:GetPlayers() == 0 then
            pcall(function() game:HttpGet("http://144.126.135.224:2758/game/stop/" .. jobId) end)
        else
            pcall(function() game:HttpGet("http://144.126.135.224:2758/game/renew/" .. jobId .. "/360") end)
        end
    end
end)


spawn(function()
game:GetService("Players").PlayerAdded:connect(function(player)
    print("Player " .. player.userId .. " added")
    player.CharacterAdded:connect(function(char)
        pcall(function()
            repeat wait() until char:FindFirstChildOfClass("Humanoid")
            local conn
            conn = char:FindFirstChildOfClass("Humanoid").Died:connect(function()
                wait(5)
                player:LoadCharacter()
                con:disconnect()
            end)
        end)
    end)
end)
end)

game:GetService("Players").PlayerRemoving:connect(function(player)
    print("Player " .. player.userId .. " leaving")
end)

------------------------------END START GAME SHARED SCRIPT--------------------------



<<<<<<< HEAD
-- StartGame -- 
=======
------------------------------END START GAME SHARED SCRIPT--------------------------

>>>>>>> master
game:GetService("RunService"):Run()
