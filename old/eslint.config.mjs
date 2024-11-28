import nikitarevenco from "eslint-config-nikitarevenco";

export default nikitarevenco(
  {
    project: "tsconfig.json",
    tsconfigRootDir: import.meta.dirname,
  },
  {
    functionalOverride: {
      "functional/immutable-data": [
        "error",
        // otherwise React eslint will complain
        { ignoreAccessorPattern: "*.displayName" },
      ],
    },
  },
  {
    ignores: [".contentlayer"],
  },
);
