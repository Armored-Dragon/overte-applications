//
//  notifications-debug.js
//
//  Created by Armored Dragon on 9 June 2025.
//  Copyright 2025 Overte e.V contributors.
//
//  A small debug app to test notifications
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

Messages.sendLocalMessage("overte.notification", JSON.stringify({ type: "system", title: "Debug test", description: "Not a good one." }))