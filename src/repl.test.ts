import { cleanInput } from "./repl";
import { describe, expect, test } from "vitest";

describe.each([
    {
        input: "  ",
        expected: [],
    },
    {
        input: "  hello  ",
        expected: ["hello"],
    },
    {
        input: "  hello  world  ",
        expected: ["hello", "world"],
    },
    {
        input: "  HellO  World  ",
        expected: ["hello", "world"],
    },
    {
        input: "Hello tO THe WORLD",
        expected: ["hello", "to", "the", "world"],
    },
])("cleanInput($input)", ({ input, expected }) => {
    test(`Expected: ${expected}`, () => {
        const actual = cleanInput(input);

        expect(actual).toHaveLength(expected.length);
        for (const i in expected) {
            expect(actual[i]).toBe(expected[i]);
        }
    });
});

