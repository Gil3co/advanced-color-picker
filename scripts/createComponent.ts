import * as fs from 'fs';
import * as path from 'path';

// Get the component name from the command line arguments
const componentName = process.argv[2];

if (!componentName) {
  console.error('❌ Please provide a component name.');
  process.exit(1);
}

// Convert to PascalCase for Svelte component
const pascalCaseName = componentName.replace(/(^\w|-\w)/g, (match) =>
  match.replace('-', '').toUpperCase(),
);

// Define paths
const componentDir = path.join(process.cwd(), componentName);
const svelteFile = path.join(componentDir, `${pascalCaseName}.svelte`);
const indexFile = path.join(componentDir, `index.ts`);

// Ensure the directory exists
if (!fs.existsSync(componentDir)) {
  fs.mkdirSync(componentDir, { recursive: true });
}

// Svelte component template
const svelteTemplate = `<script lang="ts">
    type Props = {
        dummy?: string;
    };
    let { dummy } = $props()
</script>

`;

// Index file template
const indexTemplate = `import ${pascalCaseName} from "./${pascalCaseName}.svelte";
export { ${pascalCaseName} };`;

// Write files
fs.writeFileSync(svelteFile, svelteTemplate, 'utf8');
fs.writeFileSync(indexFile, indexTemplate, 'utf8');

console.log(
  `✅ Component '${pascalCaseName}' created successfully in '${componentDir}'!`,
);
