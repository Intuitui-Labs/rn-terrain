import fs from 'node:fs';
import path from 'node:path';
import type { CAC } from 'cac';
import { consola } from 'consola';
import { TerminalRenderer } from '../preview/terminal-renderer.js';

export function registerPreviewCommands(cli: CAC) {
  cli
    .command('preview <componentPath>', 'Render a high-fidelity visual preview of a React Native component in the terminal')
    .option('--format <format>', 'Graphics format: ansi_halfblock, sixel, kitty, or ascii', { default: 'ansi_halfblock' })
    .option('--device <device>', 'Target mobile device frame: iphone-16-pro, pixel-9-pro, compact', { default: 'iphone-16-pro' })
    .option('--width <width>', 'Width in columns', { default: 46 })
    .action((componentPath, options) => {
      try {
        const fullPath = path.resolve(process.cwd(), componentPath);
        if (!fs.existsSync(fullPath)) {
          consola.error(`Component file not found: ${fullPath}`);
          process.exit(1);
        }
        const renderer = new TerminalRenderer({
          protocol: options.format,
          device: options.device,
          width: typeof options.width === 'number' ? options.width : parseInt(options.width, 10),
        });
        const previewOutput = renderer.renderFile(fullPath);
        console.log('\n' + previewOutput + '\n');
      } catch (e: any) {
        consola.error('Failed to render component preview:', e.message);
        process.exit(1);
      }
    });
}
