import { lowlight } from "lowlight/lib/core.js"

import $1c from "highlight.js/lib/languages/1c"
import abnf from "highlight.js/lib/languages/abnf"
import accesslog from "highlight.js/lib/languages/accesslog"
import actionscript from "highlight.js/lib/languages/actionscript"
import ada from "highlight.js/lib/languages/ada"
import angelscript from "highlight.js/lib/languages/angelscript"
import apache from "highlight.js/lib/languages/apache"
import applescript from "highlight.js/lib/languages/applescript"
import arcade from "highlight.js/lib/languages/arcade"
import armasm from "highlight.js/lib/languages/armasm"
import asciidoc from "highlight.js/lib/languages/asciidoc"
import aspectj from "highlight.js/lib/languages/aspectj"
import autohotkey from "highlight.js/lib/languages/autohotkey"
import autoit from "highlight.js/lib/languages/autoit"
import avrasm from "highlight.js/lib/languages/avrasm"
import awk from "highlight.js/lib/languages/awk"
import axapta from "highlight.js/lib/languages/axapta"
import basic from "highlight.js/lib/languages/basic"
import bnf from "highlight.js/lib/languages/bnf"
import brainfuck from "highlight.js/lib/languages/brainfuck"
import cal from "highlight.js/lib/languages/cal"
import capnproto from "highlight.js/lib/languages/capnproto"
import ceylon from "highlight.js/lib/languages/ceylon"
import clean from "highlight.js/lib/languages/clean"
import clojure from "highlight.js/lib/languages/clojure"
import clojureRepl from "highlight.js/lib/languages/clojure-repl"
import cmake from "highlight.js/lib/languages/cmake"
import coffeescript from "highlight.js/lib/languages/coffeescript"
import coq from "highlight.js/lib/languages/coq"
import cos from "highlight.js/lib/languages/cos"
import crmsh from "highlight.js/lib/languages/crmsh"
import crystal from "highlight.js/lib/languages/crystal"
import csp from "highlight.js/lib/languages/csp"
import d from "highlight.js/lib/languages/d"
import dart from "highlight.js/lib/languages/dart"
import delphi from "highlight.js/lib/languages/delphi"
import django from "highlight.js/lib/languages/django"
import dns from "highlight.js/lib/languages/dns"
import dockerfile from "highlight.js/lib/languages/dockerfile"
import dos from "highlight.js/lib/languages/dos"
import dsconfig from "highlight.js/lib/languages/dsconfig"
import dts from "highlight.js/lib/languages/dts"
import dust from "highlight.js/lib/languages/dust"
import ebnf from "highlight.js/lib/languages/ebnf"
import elixir from "highlight.js/lib/languages/elixir"
import elm from "highlight.js/lib/languages/elm"
import erb from "highlight.js/lib/languages/erb"
import erlang from "highlight.js/lib/languages/erlang"
import erlangRepl from "highlight.js/lib/languages/erlang-repl"
import excel from "highlight.js/lib/languages/excel"
import fix from "highlight.js/lib/languages/fix"
import flix from "highlight.js/lib/languages/flix"
import fortran from "highlight.js/lib/languages/fortran"
import fsharp from "highlight.js/lib/languages/fsharp"
import gams from "highlight.js/lib/languages/gams"
import gauss from "highlight.js/lib/languages/gauss"
import gcode from "highlight.js/lib/languages/gcode"
import gherkin from "highlight.js/lib/languages/gherkin"
import glsl from "highlight.js/lib/languages/glsl"
import gml from "highlight.js/lib/languages/gml"
import golo from "highlight.js/lib/languages/golo"
import gradle from "highlight.js/lib/languages/gradle"
import graphql from "highlight.js/lib/languages/graphql"
import groovy from "highlight.js/lib/languages/groovy"
import haml from "highlight.js/lib/languages/haml"
import handlebars from "highlight.js/lib/languages/handlebars"
import haskell from "highlight.js/lib/languages/haskell"
import haxe from "highlight.js/lib/languages/haxe"
import hsp from "highlight.js/lib/languages/hsp"
import http from "highlight.js/lib/languages/http"
import hy from "highlight.js/lib/languages/hy"
import inform7 from "highlight.js/lib/languages/inform7"
import irpf90 from "highlight.js/lib/languages/irpf90"
import isbl from "highlight.js/lib/languages/isbl"
import jbossCli from "highlight.js/lib/languages/jboss-cli"
import julia from "highlight.js/lib/languages/julia"
import juliaRepl from "highlight.js/lib/languages/julia-repl"
import lasso from "highlight.js/lib/languages/lasso"
import latex from "highlight.js/lib/languages/latex"
import ldif from "highlight.js/lib/languages/ldif"
import leaf from "highlight.js/lib/languages/leaf"
import lisp from "highlight.js/lib/languages/lisp"
import livecodeserver from "highlight.js/lib/languages/livecodeserver"
import livescript from "highlight.js/lib/languages/livescript"
import llvm from "highlight.js/lib/languages/llvm"
import lsl from "highlight.js/lib/languages/lsl"
import mathematica from "highlight.js/lib/languages/mathematica"
import matlab from "highlight.js/lib/languages/matlab"
import maxima from "highlight.js/lib/languages/maxima"
import mel from "highlight.js/lib/languages/mel"
import mercury from "highlight.js/lib/languages/mercury"
import mipsasm from "highlight.js/lib/languages/mipsasm"
import mizar from "highlight.js/lib/languages/mizar"
import mojolicious from "highlight.js/lib/languages/mojolicious"
import monkey from "highlight.js/lib/languages/monkey"
import moonscript from "highlight.js/lib/languages/moonscript"
import n1ql from "highlight.js/lib/languages/n1ql"
import nestedtext from "highlight.js/lib/languages/nestedtext"
import nginx from "highlight.js/lib/languages/nginx"
import nim from "highlight.js/lib/languages/nim"
import nix from "highlight.js/lib/languages/nix"
import nodeRepl from "highlight.js/lib/languages/node-repl"
import nsis from "highlight.js/lib/languages/nsis"
import ocaml from "highlight.js/lib/languages/ocaml"
import openscad from "highlight.js/lib/languages/openscad"
import oxygene from "highlight.js/lib/languages/oxygene"
import parser3 from "highlight.js/lib/languages/parser3"
import pf from "highlight.js/lib/languages/pf"
import pgsql from "highlight.js/lib/languages/pgsql"
import pony from "highlight.js/lib/languages/pony"
import powershell from "highlight.js/lib/languages/powershell"
import processing from "highlight.js/lib/languages/processing"
import profile from "highlight.js/lib/languages/profile"
import prolog from "highlight.js/lib/languages/prolog"
import properties from "highlight.js/lib/languages/properties"
import protobuf from "highlight.js/lib/languages/protobuf"
import puppet from "highlight.js/lib/languages/puppet"
import purebasic from "highlight.js/lib/languages/purebasic"
import q from "highlight.js/lib/languages/q"
import qml from "highlight.js/lib/languages/qml"
import reasonml from "highlight.js/lib/languages/reasonml"
import rib from "highlight.js/lib/languages/rib"
import roboconf from "highlight.js/lib/languages/roboconf"
import routeros from "highlight.js/lib/languages/routeros"
import rsl from "highlight.js/lib/languages/rsl"
import ruleslanguage from "highlight.js/lib/languages/ruleslanguage"
import sas from "highlight.js/lib/languages/sas"
import scala from "highlight.js/lib/languages/scala"
import scheme from "highlight.js/lib/languages/scheme"
import scilab from "highlight.js/lib/languages/scilab"
import smali from "highlight.js/lib/languages/smali"
import smalltalk from "highlight.js/lib/languages/smalltalk"
import sml from "highlight.js/lib/languages/sml"
import sqf from "highlight.js/lib/languages/sqf"
import stan from "highlight.js/lib/languages/stan"
import stata from "highlight.js/lib/languages/stata"
import step21 from "highlight.js/lib/languages/step21"
import stylus from "highlight.js/lib/languages/stylus"
import subunit from "highlight.js/lib/languages/subunit"
import taggerscript from "highlight.js/lib/languages/taggerscript"
import tap from "highlight.js/lib/languages/tap"
import tcl from "highlight.js/lib/languages/tcl"
import thrift from "highlight.js/lib/languages/thrift"
import tp from "highlight.js/lib/languages/tp"
import twig from "highlight.js/lib/languages/twig"
import vala from "highlight.js/lib/languages/vala"
import vbscript from "highlight.js/lib/languages/vbscript"
import vbscriptHtml from "highlight.js/lib/languages/vbscript-html"
import verilog from "highlight.js/lib/languages/verilog"
import vhdl from "highlight.js/lib/languages/vhdl"
import vim from "highlight.js/lib/languages/vim"
import wasm from "highlight.js/lib/languages/wasm"
import wren from "highlight.js/lib/languages/wren"
import x86asm from "highlight.js/lib/languages/x86asm"
import xl from "highlight.js/lib/languages/xl"
import xquery from "highlight.js/lib/languages/xquery"
import zephir from "highlight.js/lib/languages/zephir"

import arduino from "highlight.js/lib/languages/arduino"
import bash from "highlight.js/lib/languages/bash"
import c from "highlight.js/lib/languages/c"
import cpp from "highlight.js/lib/languages/cpp"
import csharp from "highlight.js/lib/languages/csharp"
import css from "highlight.js/lib/languages/css"
import diff from "highlight.js/lib/languages/diff"
import go from "highlight.js/lib/languages/go"
import ini from "highlight.js/lib/languages/ini"
import java from "highlight.js/lib/languages/java"
import javascript from "highlight.js/lib/languages/javascript"
import json from "highlight.js/lib/languages/json"
import kotlin from "highlight.js/lib/languages/kotlin"
import less from "highlight.js/lib/languages/less"
import lua from "highlight.js/lib/languages/lua"
import makefile from "highlight.js/lib/languages/makefile"
import markdown from "highlight.js/lib/languages/markdown"
import objectivec from "highlight.js/lib/languages/objectivec"
import perl from "highlight.js/lib/languages/perl"
import php from "highlight.js/lib/languages/php"
import phpTemplate from "highlight.js/lib/languages/php-template"
import plaintext from "highlight.js/lib/languages/plaintext"
// import python from "highlight.js/lib/languages/python"
import pythonRepl from "highlight.js/lib/languages/python-repl"
import r from "highlight.js/lib/languages/r"
import ruby from "highlight.js/lib/languages/ruby"
import rust from "highlight.js/lib/languages/rust"
import scss from "highlight.js/lib/languages/scss"
import shell from "highlight.js/lib/languages/shell"
import sql from "highlight.js/lib/languages/sql"
import swift from "highlight.js/lib/languages/swift"
import typescript from "highlight.js/lib/languages/typescript"
import vbnet from "highlight.js/lib/languages/vbnet"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"

function source(re) {
    if (!re) return null
    if (typeof re === "string") return re

    return re.source
}
function lookahead(re) {
    return concat("(?=", re, ")")
}
function concat(...args) {
    const joined = args.map((x) => source(x)).join("")
    return joined
}

function python(hljs) {
    const RESERVED_WORDS = [
        "and",
        "as",
        "assert",
        "async",
        "await",
        "break",
        "class",
        "continue",
        "def",
        "del",
        "elif",
        "else",
        "except",
        "finally",
        "for",
        "from",
        "global",
        "if",
        "import",
        "in",
        "is",
        "lambda",
        "nonlocal|10",
        "not",
        "or",
        "pass",
        "raise",
        "return",
        "try",
        "while",
        "with",
        "yield",
    ]

    const BUILT_INS = [
        "__import__",
        "abs",
        "all",
        "any",
        "ascii",
        "bin",
        "bool",
        "breakpoint",
        "bytearray",
        "bytes",
        "callable",
        "chr",
        "classmethod",
        "compile",
        "complex",
        "delattr",
        "dict",
        "dir",
        "divmod",
        "enumerate",
        "eval",
        "exec",
        "filter",
        "float",
        "format",
        "frozenset",
        "getattr",
        "globals",
        "hasattr",
        "hash",
        "help",
        "hex",
        "id",
        "input",
        "int",
        "isinstance",
        "issubclass",
        "iter",
        "len",
        "list",
        "locals",
        "map",
        "max",
        "memoryview",
        "min",
        "next",
        "object",
        "oct",
        "open",
        "ord",
        "pow",
        "print",
        "property",
        "range",
        "repr",
        "reversed",
        "round",
        "set",
        "setattr",
        "slice",
        "sorted",
        "staticmethod",
        "str",
        "sum",
        "super",
        "tuple",
        "type",
        "vars",
        "zip",
    ]

    const LITERALS = [
        "__debug__",
        "Ellipsis",
        "False",
        "None",
        "NotImplemented",
        "True",
    ]

    // https://docs.python.org/3/library/typing.html
    // TODO: Could these be supplemented by a CamelCase matcher in certain
    // contexts, leaving these remaining only for relevance hinting?
    const TYPES = [
        "Any",
        "Callable",
        "Coroutine",
        "Dict",
        "List",
        "Literal",
        "Generic",
        "Optional",
        "Sequence",
        "Set",
        "Tuple",
        "Type",
        "Union",
    ]

    const KEYWORDS = {
        $pattern: /[A-Za-z]\w+|__\w+__/,
        keyword: RESERVED_WORDS,
        built_in: BUILT_INS,
        literal: LITERALS,
        type: TYPES,
    }

    const PROMPT = {
        className: "meta",
        begin: /^(>>>|\.\.\.) /,
    }

    const SUBST = {
        className: "subst",
        begin: /\{/,
        end: /\}/,
        keywords: KEYWORDS,
        illegal: /#/,
    }

    const LITERAL_BRACKET = {
        begin: /\{\{/,
        relevance: 0,
    }

    const STRING = {
        className: "string",
        contains: [hljs.BACKSLASH_ESCAPE],
        variants: [
            {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,
                end: /'''/,
                contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
                relevance: 10,
            },
            {
                begin: /([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,
                end: /"""/,
                contains: [hljs.BACKSLASH_ESCAPE, PROMPT],
                relevance: 10,
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])'''/,
                end: /'''/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT,
                    LITERAL_BRACKET,
                    SUBST,
                ],
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])"""/,
                end: /"""/,
                contains: [
                    hljs.BACKSLASH_ESCAPE,
                    PROMPT,
                    LITERAL_BRACKET,
                    SUBST,
                ],
            },
            {
                begin: /([uU]|[rR])'/,
                end: /'/,
                relevance: 10,
            },
            {
                begin: /([uU]|[rR])"/,
                end: /"/,
                relevance: 10,
            },
            {
                begin: /([bB]|[bB][rR]|[rR][bB])'/,
                end: /'/,
            },
            {
                begin: /([bB]|[bB][rR]|[rR][bB])"/,
                end: /"/,
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])'/,
                end: /'/,
                contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST],
            },
            {
                begin: /([fF][rR]|[rR][fF]|[fF])"/,
                end: /"/,
                contains: [hljs.BACKSLASH_ESCAPE, LITERAL_BRACKET, SUBST],
            },
            hljs.APOS_STRING_MODE,
            hljs.QUOTE_STRING_MODE,
        ],
    }

    // https://docs.python.org/3.9/reference/lexical_analysis.html#numeric-literals
    const digitpart = "[0-9](_?[0-9])*"
    const pointfloat = `(\\b(${digitpart}))?\\.(${digitpart})|\\b(${digitpart})\\.`
    const NUMBER = {
        className: "number",
        relevance: 0,
        variants: [
            // exponentfloat, pointfloat
            // https://docs.python.org/3.9/reference/lexical_analysis.html#floating-point-literals
            // optionally imaginary
            // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
            // Note: no leading \b because floats can start with a decimal point
            // and we don't want to mishandle e.g. `fn(.5)`,
            // no trailing \b for pointfloat because it can end with a decimal point
            // and we don't want to mishandle e.g. `0..hex()`; this should be safe
            // because both MUST contain a decimal point and so cannot be confused with
            // the interior part of an identifier
            {
                begin: `(\\b(${digitpart})|(${pointfloat}))[eE][+-]?(${digitpart})[jJ]?\\b`,
            },
            {
                begin: `(${pointfloat})[jJ]?`,
            },

            // decinteger, bininteger, octinteger, hexinteger
            // https://docs.python.org/3.9/reference/lexical_analysis.html#integer-literals
            // optionally "long" in Python 2
            // https://docs.python.org/2.7/reference/lexical_analysis.html#integer-and-long-integer-literals
            // decinteger is optionally imaginary
            // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
            {
                begin: "\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b",
            },
            {
                begin: "\\b0[bB](_?[01])+[lL]?\\b",
            },
            {
                begin: "\\b0[oO](_?[0-7])+[lL]?\\b",
            },
            {
                begin: "\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b",
            },

            // imagnumber (digitpart-based)
            // https://docs.python.org/3.9/reference/lexical_analysis.html#imaginary-literals
            {
                begin: `\\b(${digitpart})[jJ]\\b`,
            },
        ],
    }
    const COMMENT_TYPE = {
        className: "comment",
        begin: lookahead(/# type:/),
        end: /$/,
        keywords: KEYWORDS,
        contains: [
            {
                // prevent keywords from coloring `type`
                begin: /# type:/,
            },
            // comment within a datatype comment includes no keywords
            {
                begin: /#/,
                end: /\b\B/,
                endsWithParent: true,
            },
        ],
    }
    const PARAMS = {
        className: "params",
        variants: [
            // Exclude params in functions without params
            {
                className: "",
                begin: /\(\s*\)/,
                skip: true,
            },
            {
                begin: /\(/,
                end: /\)/,
                excludeBegin: true,
                excludeEnd: true,
                keywords: KEYWORDS,
                contains: [
                    "self",
                    PROMPT,
                    NUMBER,
                    STRING,
                    hljs.HASH_COMMENT_MODE,
                ],
            },
        ],
    }
    SUBST.contains = [STRING, NUMBER, PROMPT]

    return {
        name: "Python",
        aliases: ["py", "gyp", "ipython"],
        keywords: KEYWORDS,
        illegal: /(<\/|->|\?)|=>/,
        contains: [
            PROMPT,
            NUMBER,
            {
                // very common convention
                begin: /\bself\b/,
            },
            {
                // eat "if" prior to string so that it won't accidentally be
                // labeled as an f-string
                beginKeywords: "if",
                relevance: 0,
            },
            STRING,
            COMMENT_TYPE,
            hljs.HASH_COMMENT_MODE,
            {
                variants: [
                    {
                        className: "function",
                        beginKeywords: "def",
                    },
                    {
                        className: "class",
                        beginKeywords: "class",
                    },
                ],
                end: /:/,
                illegal: /[${=;\n,]/,
                contains: [
                    hljs.UNDERSCORE_TITLE_MODE,
                    PARAMS,
                    {
                        begin: /->/,
                        endsWithParent: true,
                        keywords: KEYWORDS,
                    },
                ],
            },
            {
                className: "meta",
                begin: /^[\t ]*@/,
                end: /(?=#)|$/,
                contains: [NUMBER, PARAMS, STRING],
            },
        ],
    }
}

lowlight.registerLanguage("arduino", arduino)
lowlight.registerLanguage("bash", bash)
lowlight.registerLanguage("c", c)
lowlight.registerLanguage("cpp", cpp)
lowlight.registerLanguage("c++", cpp)
lowlight.registerLanguage("csharp", csharp)
lowlight.registerLanguage("css", css)
lowlight.registerLanguage("diff", diff)
lowlight.registerLanguage("go", go)
lowlight.registerLanguage("golang", go)
lowlight.registerLanguage("ini", ini)
lowlight.registerLanguage("java", java)
lowlight.registerLanguage("javascript", javascript)
lowlight.registerLanguage("js", javascript)
lowlight.registerLanguage("json", json)
lowlight.registerLanguage("kotlin", kotlin)
lowlight.registerLanguage("less", less)
lowlight.registerLanguage("lua", lua)
lowlight.registerLanguage("makefile", makefile)
lowlight.registerLanguage("markdown", markdown)
lowlight.registerLanguage("objectivec", objectivec)
lowlight.registerLanguage("perl", perl)
lowlight.registerLanguage("php", php)
lowlight.registerLanguage("php-template", phpTemplate)
lowlight.registerLanguage("plaintext", plaintext)
lowlight.registerLanguage("python", python)
lowlight.registerLanguage("python-repl", pythonRepl)
lowlight.registerLanguage("r", r)
lowlight.registerLanguage("ruby", ruby)
lowlight.registerLanguage("rust", rust)
lowlight.registerLanguage("scss", scss)
lowlight.registerLanguage("shell", shell)
lowlight.registerLanguage("sql", sql)
lowlight.registerLanguage("swift", swift)
lowlight.registerLanguage("typescript", typescript)
lowlight.registerLanguage("vbnet", vbnet)
lowlight.registerLanguage("html", xml)
lowlight.registerLanguage("xml", xml)
lowlight.registerLanguage("yaml", yaml)
lowlight.registerLanguage("yml", yaml)

lowlight.registerLanguage("1c", $1c)
lowlight.registerLanguage("abnf", abnf)
lowlight.registerLanguage("accesslog", accesslog)
lowlight.registerLanguage("actionscript", actionscript)
lowlight.registerLanguage("ada", ada)
lowlight.registerLanguage("angelscript", angelscript)
lowlight.registerLanguage("apache", apache)
lowlight.registerLanguage("applescript", applescript)
lowlight.registerLanguage("arcade", arcade)
lowlight.registerLanguage("armasm", armasm)
lowlight.registerLanguage("asciidoc", asciidoc)
lowlight.registerLanguage("aspectj", aspectj)
lowlight.registerLanguage("autohotkey", autohotkey)
lowlight.registerLanguage("autoit", autoit)
lowlight.registerLanguage("avrasm", avrasm)
lowlight.registerLanguage("awk", awk)
lowlight.registerLanguage("axapta", axapta)
lowlight.registerLanguage("basic", basic)
lowlight.registerLanguage("bnf", bnf)
lowlight.registerLanguage("brainfuck", brainfuck)
lowlight.registerLanguage("cal", cal)
lowlight.registerLanguage("capnproto", capnproto)
lowlight.registerLanguage("ceylon", ceylon)
lowlight.registerLanguage("clean", clean)
lowlight.registerLanguage("clojure", clojure)
lowlight.registerLanguage("clojure-repl", clojureRepl)
lowlight.registerLanguage("cmake", cmake)
lowlight.registerLanguage("coffeescript", coffeescript)
lowlight.registerLanguage("coq", coq)
lowlight.registerLanguage("cos", cos)
lowlight.registerLanguage("crmsh", crmsh)
lowlight.registerLanguage("crystal", crystal)
lowlight.registerLanguage("csp", csp)
lowlight.registerLanguage("d", d)
lowlight.registerLanguage("dart", dart)
lowlight.registerLanguage("delphi", delphi)
lowlight.registerLanguage("django", django)
lowlight.registerLanguage("dns", dns)
lowlight.registerLanguage("dockerfile", dockerfile)
lowlight.registerLanguage("dos", dos)
lowlight.registerLanguage("dsconfig", dsconfig)
lowlight.registerLanguage("dts", dts)
lowlight.registerLanguage("dust", dust)
lowlight.registerLanguage("ebnf", ebnf)
lowlight.registerLanguage("elixir", elixir)
lowlight.registerLanguage("elm", elm)
lowlight.registerLanguage("erb", erb)
lowlight.registerLanguage("erlang", erlang)
lowlight.registerLanguage("erlang-repl", erlangRepl)
lowlight.registerLanguage("excel", excel)
lowlight.registerLanguage("fix", fix)
lowlight.registerLanguage("flix", flix)
lowlight.registerLanguage("fortran", fortran)
lowlight.registerLanguage("fsharp", fsharp)
lowlight.registerLanguage("gams", gams)
lowlight.registerLanguage("gauss", gauss)
lowlight.registerLanguage("gcode", gcode)
lowlight.registerLanguage("gherkin", gherkin)
lowlight.registerLanguage("glsl", glsl)
lowlight.registerLanguage("gml", gml)
lowlight.registerLanguage("golo", golo)
lowlight.registerLanguage("gradle", gradle)
lowlight.registerLanguage("graphql", graphql)
lowlight.registerLanguage("groovy", groovy)
lowlight.registerLanguage("haml", haml)
lowlight.registerLanguage("handlebars", handlebars)
lowlight.registerLanguage("haskell", haskell)
lowlight.registerLanguage("haxe", haxe)
lowlight.registerLanguage("hsp", hsp)
lowlight.registerLanguage("http", http)
lowlight.registerLanguage("hy", hy)
lowlight.registerLanguage("inform7", inform7)
lowlight.registerLanguage("irpf90", irpf90)
lowlight.registerLanguage("isbl", isbl)
lowlight.registerLanguage("jboss-cli", jbossCli)
lowlight.registerLanguage("julia", julia)
lowlight.registerLanguage("julia-repl", juliaRepl)
lowlight.registerLanguage("lasso", lasso)
lowlight.registerLanguage("latex", latex)
lowlight.registerLanguage("ldif", ldif)
lowlight.registerLanguage("leaf", leaf)
lowlight.registerLanguage("lisp", lisp)
lowlight.registerLanguage("livecodeserver", livecodeserver)
lowlight.registerLanguage("livescript", livescript)
lowlight.registerLanguage("llvm", llvm)
lowlight.registerLanguage("lsl", lsl)
lowlight.registerLanguage("mathematica", mathematica)
lowlight.registerLanguage("matlab", matlab)
lowlight.registerLanguage("maxima", maxima)
lowlight.registerLanguage("mel", mel)
lowlight.registerLanguage("mercury", mercury)
lowlight.registerLanguage("mipsasm", mipsasm)
lowlight.registerLanguage("mizar", mizar)
lowlight.registerLanguage("mojolicious", mojolicious)
lowlight.registerLanguage("monkey", monkey)
lowlight.registerLanguage("moonscript", moonscript)
lowlight.registerLanguage("n1ql", n1ql)
lowlight.registerLanguage("nestedtext", nestedtext)
lowlight.registerLanguage("nginx", nginx)
lowlight.registerLanguage("nim", nim)
lowlight.registerLanguage("nix", nix)
lowlight.registerLanguage("node-repl", nodeRepl)
lowlight.registerLanguage("nsis", nsis)
lowlight.registerLanguage("ocaml", ocaml)
lowlight.registerLanguage("openscad", openscad)
lowlight.registerLanguage("oxygene", oxygene)
lowlight.registerLanguage("parser3", parser3)
lowlight.registerLanguage("pf", pf)
lowlight.registerLanguage("pgsql", pgsql)
lowlight.registerLanguage("pony", pony)
lowlight.registerLanguage("powershell", powershell)
lowlight.registerLanguage("processing", processing)
lowlight.registerLanguage("profile", profile)
lowlight.registerLanguage("prolog", prolog)
lowlight.registerLanguage("properties", properties)
lowlight.registerLanguage("protobuf", protobuf)
lowlight.registerLanguage("puppet", puppet)
lowlight.registerLanguage("purebasic", purebasic)
lowlight.registerLanguage("q", q)
lowlight.registerLanguage("qml", qml)
lowlight.registerLanguage("reasonml", reasonml)
lowlight.registerLanguage("rib", rib)
lowlight.registerLanguage("roboconf", roboconf)
lowlight.registerLanguage("routeros", routeros)
lowlight.registerLanguage("rsl", rsl)
lowlight.registerLanguage("ruleslanguage", ruleslanguage)
lowlight.registerLanguage("sas", sas)
lowlight.registerLanguage("scala", scala)
lowlight.registerLanguage("scheme", scheme)
lowlight.registerLanguage("scilab", scilab)
lowlight.registerLanguage("smali", smali)
lowlight.registerLanguage("smalltalk", smalltalk)
lowlight.registerLanguage("sml", sml)
lowlight.registerLanguage("sqf", sqf)
lowlight.registerLanguage("stan", stan)
lowlight.registerLanguage("stata", stata)
lowlight.registerLanguage("step21", step21)
lowlight.registerLanguage("stylus", stylus)
lowlight.registerLanguage("subunit", subunit)
lowlight.registerLanguage("taggerscript", taggerscript)
lowlight.registerLanguage("tap", tap)
lowlight.registerLanguage("tcl", tcl)
lowlight.registerLanguage("thrift", thrift)
lowlight.registerLanguage("tp", tp)
lowlight.registerLanguage("twig", twig)
lowlight.registerLanguage("vala", vala)
lowlight.registerLanguage("vbscript", vbscript)
lowlight.registerLanguage("vbscript-html", vbscriptHtml)
lowlight.registerLanguage("verilog", verilog)
lowlight.registerLanguage("vhdl", vhdl)
lowlight.registerLanguage("vim", vim)
lowlight.registerLanguage("wasm", wasm)
lowlight.registerLanguage("wren", wren)
lowlight.registerLanguage("x86asm", x86asm)
lowlight.registerLanguage("xl", xl)
lowlight.registerLanguage("xquery", xquery)
lowlight.registerLanguage("zephir", zephir)

export { lowlight }
