import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';

const specs = YAML.load(path.join(__dirname, './build/swagger.yaml'));

export { swaggerUi, specs };