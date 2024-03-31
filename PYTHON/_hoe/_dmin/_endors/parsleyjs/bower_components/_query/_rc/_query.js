{
    "additionalProperties": false,
    "type": "object",
    "properties": {
        "additionalManifestEntries": {
            "description": "A list of entries to be precached, in addition to any entries that are\ngenerated as part of the build configuration.",
            "type": "array",
            "items": {
                "anyOf": [
                    {
                        "$ref": "#/definitions/ManifestEntry"
                    },
                    {
                        "type": "string"
                    }
                ]
            }
     