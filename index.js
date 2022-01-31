const SwaggerParser = require("@apidevtools/swagger-parser");
const Yaml = require("yaml");
const fs = require("fs").promises;
const path = require("path");

const sourceFolder = "src";
const destinationFolder = "build";
const openapiFiles = [
	"auth_service-contract.yml",
	"user_service-contract.yml",
	"inventory_service-contract.yml",
];

fs.mkdir(destinationFolder, { recursive: true }).then((_) => {
	const promises = [];
	openapiFiles.forEach((fileName) => {
		promises.push(
			SwaggerParser.validate(path.join(sourceFolder, fileName))
				.then((api) => {
					return SwaggerParser.bundle(api, { yaml: true });
				})
				.then((bundledDeferencedApi) => {
					return fs
						.writeFile(
							path.join(destinationFolder, fileName),
							Yaml.stringify(bundledDeferencedApi)
						)
						.then((_) =>
							console.log(
								"API name: %s\tVersion: %s\tBundled",
								bundledDeferencedApi.info.title,
								bundledDeferencedApi.info.version
							)
						);
				})
		);
	});

	return Promise.all(promises);
});
