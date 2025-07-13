/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const dirOutput = `
 Volume in drive C is MARVIN
 Volume Serial Number is 96D7-3867

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS

07/02/2025  12:11 PM    <DIR>          .
07/02/2025  12:10 PM    <DIR>          ..
07/02/2025  12:10 PM    <DIR>          backend
07/02/2025  12:11 PM    <DIR>          frontend
               0 File(s)              0 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\backend

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:11 PM    <DIR>          ..
07/02/2025  12:10 PM            10,229 admin.html
07/02/2025  12:10 PM            11,785 familiar.main.py
07/02/2025  12:10 PM             7,763 infinite_content_generator.py
07/02/2025  12:10 PM    <DIR>          obs_bridge
07/02/2025  12:10 PM    <DIR>          scroll_server
               3 File(s)         29,777 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\backend\\obs_bridge

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:10 PM    <DIR>          ..
07/02/2025  12:10 PM            67,501 package-lock.json
07/02/2025  12:10 PM               703 package.json
07/02/2025  12:10 PM             5,351 server.js
               3 File(s)         73,555 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\backend\\scroll_server

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:10 PM    <DIR>          ..
07/02/2025  12:10 PM             4,081 index.js
07/02/2025  12:10 PM    <DIR>          MystraBrain
07/02/2025  12:10 PM               520 package.json
               2 File(s)          4,601 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\backend\\scroll_server\\MystraBrain

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:10 PM    <DIR>          ..
07/02/2025  12:10 PM             3,487 mystra_core_nlds_combined.txt
07/02/2025  12:10 PM             6,747 mystra_llm_core.js
               2 File(s)         10,234 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\frontend

07/02/2025  12:11 PM    <DIR>          .
07/02/2025  12:11 PM    <DIR>          ..
07/02/2025  12:10 PM         1,277,935 Clay_Animation_to_.mp4
07/02/2025  12:10 PM    <DIR>          components
07/02/2025  12:10 PM               212 custom.d.ts
07/02/2025  12:10 PM             4,747 index.css
07/02/2025  12:10 PM             1,160 index.html
07/02/2025  12:10 PM            11,760 index.tsx
07/02/2025  12:10 PM    <DIR>          static_site
07/02/2025  12:10 PM               675 tsconfig.json
07/02/2025  12:10 PM               441 vite.config.ts
               7 File(s)      1,296,930 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\frontend\\components

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:11 PM    <DIR>          ..
07/02/2025  12:10 PM             5,468 Case Study A Novel Human-AI Symbios.txt
07/02/2025  12:10 PM            11,785 familiar.main.py
07/02/2025  12:10 PM            17,340 logos-companion.js
               3 File(s)         34,593 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\frontend\\static_site

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:11 PM    <DIR>          ..
07/02/2025  12:10 PM            33,608 academy_resource.01_6.12.25_12.59.am.html.html
07/02/2025  12:10 PM             5,434 Case Study A Novel Human-AI Symbios.txt
07/02/2025  12:10 PM            19,559 Industry Trends & Market Research AI Assistants.html
07/02/2025  12:10 PM             7,110 nexus.html
07/02/2025  12:10 PM             8,786 tutorial.html
07/02/2025  12:10 PM    <DIR>          txt for ftp
               5 File(s)         74,497 bytes

 Directory of C:\\Users\\zakde\\MyOSproject\\MyOS\\frontend\\static_site\\txt for ftp

07/02/2025  12:10 PM    <DIR>          .
07/02/2025  12:10 PM    <DIR>          ..
07/02/2025  12:10 PM            57,476 mystra_core_nlds_combined.txt
07/02/2025  12:10 PM             4,334 NLD PESTER_CONCEPT.NLD.txt
07/02/2025  12:10 PM             2,461 README.md
               3 File(s)         64,271 bytes
`;

type FileNodeData = { type: 'file'; name: string; size: number };
type DirNodeData = { type: 'dir'; name: string; children: (FileNodeData | DirNodeData)[] };

function parseDirOutput(text: string): DirNodeData {
    const blocks = text.split(/Directory of /).filter(b => b.trim());
    const rootPath = 'C:\\Users\\zakde\\MyOSproject\\MyOS';
    
    const rootNode: DirNodeData = {
        name: 'MyOS',
        type: 'dir',
        children: []
    };

    const nodeMap = new Map<string, DirNodeData>();
    nodeMap.set(rootPath, rootNode);

    // Pass 1: Build directory skeleton
    for (const block of blocks) {
        const lines = block.split('\n');
        const path = lines[0].trim();
        
        // Skip paths that are not subdirectories of our root
        if (!path.startsWith(rootPath)) continue;

        let parentNode = rootNode;
        let currentPath = rootPath;

        const relativePath = path.substring(rootPath.length);
        const pathParts = relativePath.split('\\').filter(Boolean);

        for (const part of pathParts) {
            const nextPath = `${currentPath}\\${part}`;
            let childNode = nodeMap.get(nextPath);
            if (!childNode) {
                childNode = { name: part, type: 'dir', children: [] };
                // Check if parent already has a dir with this name before adding
                if (!parentNode.children.some(c => c.type === 'dir' && c.name === part)) {
                    parentNode.children.push(childNode);
                }
                nodeMap.set(nextPath, childNode);
            }
            parentNode = childNode;
            currentPath = nextPath;
        }
    }
    
    // Pass 2: Populate files
    for (const block of blocks) {
        const lines = block.split('\n');
        const path = lines[0].trim();
        const dirNode = nodeMap.get(path);

        if (!dirNode) continue;

        for (const line of lines) {
            const fileMatch = line.match(/^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s[AP]M\s+([\d,]+)\s(.+)/);
            if (fileMatch) {
                const size = parseInt(fileMatch[1].replace(/,/g, ''), 10);
                const name = fileMatch[2].trim();
                // Avoid adding duplicate files
                if (!dirNode.children.some(c => c.name === name)) {
                    dirNode.children.push({ name, type: 'file', size });
                }
            }
        }
    }

    // Sort children: directories first, then alphabetically
    const sortChildren = (node: DirNodeData) => {
        node.children.sort((a, b) => {
            if (a.type === 'dir' && b.type === 'file') return -1;
            if (a.type === 'file' && b.type === 'dir') return 1;
            return a.name.localeCompare(b.name);
        });
        node.children.forEach(child => {
            if (child.type === 'dir') {
                sortChildren(child);
            }
        });
    };

    sortChildren(rootNode);

    return rootNode;
}


function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const FolderIcon = () => (
    <svg className="tree-node-icon icon-folder" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"></path>
    </svg>
);

const FileIcon = () => (
    <svg className="tree-node-icon icon-file" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"></path>
    </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`tree-node-icon icon-chevron ${open ? 'open' : ''}`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
    </svg>
);

const FileNode: React.FC<FileNodeData> = ({ name, size }) => (
    <li className="tree-node">
        <FileIcon />
        <span className="node-name">{name}</span>
        <span className="file-size">{formatBytes(size)}</span>
    </li>
);

const DirectoryNode: React.FC<DirNodeData & { defaultOpen?: boolean }> = ({ name, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <li>
            <div className="tree-node" onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setIsOpen(!isOpen)}>
                <ChevronIcon open={isOpen} />
                <FolderIcon />
                <span className="node-name">{name}</span>
            </div>
            {isOpen && (
                <ul>
                    {children.map(child =>
                        child.type === 'dir' ? (
                            <DirectoryNode key={child.name} {...child} />
                        ) : (
                            <FileNode key={child.name} {...child} />
                        )
                    )}
                </ul>
            )}
        </li>
    );
};

function App() {
  const fileTree = parseDirOutput(dirOutput);

  return (
    <main className="explorer-container">
      <h1>File Explorer</h1>
      <ul>
        <DirectoryNode {...fileTree} defaultOpen={true} />
      </ul>
    </main>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
