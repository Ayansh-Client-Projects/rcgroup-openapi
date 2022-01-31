const SwaggerParser = require("@apidevtools/swagger-parser");
const fs = require("fs").promises;
const path = require("path");

const sourceFolder = "src";
const destinationFolder = "build";
const openapiFiles = [
	"auth_service-contract.yml",
	"user_service-contract.yml",
	"inventory_service-contract.yml",
];

openapiFiles.forEach((fileName) => {
	SwaggerParser.validate(path.join(sourceFolder, fileName))
		.then((api) => {
			return SwaggerParser.bundle(api);
		})
		.then((bundledApi) => {
			return SwaggerParser.dereference(bundledApi);
		})
		.then((bundledDeferencedApi) => {
			return fs
				.mkdir(destinationFolder, { recursive: true })
				.then((_) =>
					fs.writeFile(
						path.join(destinationFolder, fileName),
						JSON.stringify(bundledDeferencedApi, null, 2)
					)
				)
				.then((x) => bundledDeferencedApi);
		})
		.then((api) =>
			console.log(
				"API name: %s\tVersion: %s\tDeferenced & Bundled",
				api.info.title,
				api.info.version
			)
		);
});
