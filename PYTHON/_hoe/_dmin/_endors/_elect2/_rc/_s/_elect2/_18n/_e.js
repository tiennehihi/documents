/*
 * STOP!!! DO NOT MODIFY.
 *
 * This file is part of the ongoing work to move the eslintrc-style config
 * system into the @eslint/eslintrc package. This file needs to remain
 * unchanged in order for this work to proceed.
 *
 * If you think you need to change this file, please contact @nzakas first.
 *
 * Thanks in advance for your cooperation.
 */

/**
 * @fileoverview Validates configs.
 * @author Brandon Mills
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const
    util = require("util"),
    configSchema = require("../../conf/config-schema"),
    BuiltInRules = require("../rules"),
    {
        Legacy: {
            ConfigOps,
            environments: BuiltInEnvironments
        }
    } = require("@eslint/eslintrc"),
 