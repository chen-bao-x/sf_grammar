/**
 * @file SfGrammar grammar for tree-sitter
 * @author chenbao
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-nocheck

export default grammar({
  name: "sf",

  rules: {
    source_file: ($) => repeat($.block),

    // ast

    block: ($) =>
      seq(
        optional(
          repeat(
            choice(
              $.body_text, // 开头不是 [ ] { } \n  中间不是 [ ] { } \n \ 的字符.
              $.name_mark,
              $.writer_mark,
            ),
          ),
        ),

        $.new_line,
      ),

    name_mark: ($) => seq($.l_bracket, optional($.name_text), $.r_bracket),
    writer_mark: ($) => seq($.l_brace, optional($.comment_text), $.r_brace),

    // tokens

    l_bracket: ($) => token("["),
    r_bracket: ($) => token("]"),

    l_brace: ($) => token("{"),
    r_brace: ($) => token("}"),

    new_line: ($) => token("\n"),

    name_text: ($) =>
      token(
        repeat1(
          choice(
            /[^{}\[\]\\\n]{1,}/,
            seq("\\", choice("[", "{", "]", "}", "\\")),
          ),
        ),
      ), // 注释;

    comment_text: ($) =>
      token(
        repeat1(
          choice(
            /[^}\\]{1,}/,
            seq("\\", choice("[", "{", "]", "}", "\\")),
          ),
        ),
      ), // 注释;

    // 这个版本会把这些组合成一个 token，
    body_text: ($) =>
      token(
        repeat1(
          choice(
            /[^{}\[\]\n\\]+/, // 开头不是 [ ] { } \n  中间不是 [ ] { } \n \ 的任何字符.
            seq("\\", choice("[", "{", "]", "}", "\\")), // // 处理转义符号匹配  \[, \{ \\ \] \}
          ),
        ),
      ),
  },
});
