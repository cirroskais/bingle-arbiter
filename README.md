# bingle-arbiter

The Bingle arbiter is designed to be used with almost any revival backend.

It comes preloaded with some Lua scripts made by kinery and jackd900.

You **will** have to replace/modify these scripts when implementing for your own projects.

Set your desired settings in `.env.example`, then rename it to `.env`.

## Routes

### GET /render/asset/:id

<details>
<summary>200 OK</summary>

```
iVBORw0KGgoAAAANSUhEUgAAAtAAAALQCAYAAAC...
```

</details>

### GET /render/asset/3d/:id

<details>
<summary>200 OK</summary>

```json
{
	"camera": {
		"position": { "x": 0, "y": 0, "z": 0 },
		"direction": { "x": 0, "y": 0, "z": 0 }
	},
	"AABB": {
		"min": { "x": 0, "y": 0, "z": 0 },
		"max": { "x": 0, "y": 0, "z": 0 }
	},
	"files": {
		"scene.obj": { "content": "..." },
		"scene.mtl": { "content": "..." },
		"Handle1Tex.png": { "content": "..." }
	}
}
```

</details>

### GET /render/texture/:id

<details>
<summary>200 OK</summary>

```
iVBORw0KGgoAAAANSUhEUgAAAtAAAALQCAYAAAC...
```

</details>

### GET /render/user/headshot/:id

<details>
<summary>200 OK</summary>

```
iVBORw0KGgoAAAANSUhEUgAAAtAAAALQCAYAAAC...
```

</details>

### GET /render/user/bodyshot/:id

<details>
<summary>200 OK</summary>

```
iVBORw0KGgoAAAANSUhEUgAAAtAAAALQCAYAAAC...
```

</details>

### GET /render/user/3d/:id

<details>
<summary>200 OK</summary>

```json
{
	"camera": {
		"position": { "x": 0, "y": 0, "z": 0 },
		"direction": { "x": 0, "y": 0, "z": 0 }
	},
	"AABB": {
		"min": { "x": 0, "y": 0, "z": 0 },
		"max": { "x": 0, "y": 0, "z": 0 }
	},
	"files": {
		"scene.obj": { "content": "..." },
		"scene.mtl": { "content": "..." },
		"Handle1Tex.png": { "content": "..." }
	}
}
```

</details>
