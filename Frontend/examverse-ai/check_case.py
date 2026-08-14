import os
import re

def check_imports(directory):
    for root, _, files in os.walk(directory):
        if 'node_modules' in root or 'dist' in root:
            continue
        
        for file in files:
            if file.endswith(('.js', '.jsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Match import statements like import X from './path' or import './path'
                imports = re.findall(r'from\s+[\'"]([^\'"]+)[\'"]|import\s+[\'"]([^\'"]+)[\'"]', content)
                for imp_tuple in imports:
                    imp = imp_tuple[0] or imp_tuple[1]
                    if imp.startswith('.'):
                        # Resolve the path
                        base_dir = os.path.dirname(filepath)
                        
                        # Handle potential extensions
                        target_paths = [
                            imp,
                            imp + '.js',
                            imp + '.jsx',
                            imp + '.css',
                            imp + '.module.css',
                            imp + '/index.js',
                            imp + '/index.jsx'
                        ]
                        
                        found = False
                        for p in target_paths:
                            target_full_path = os.path.normpath(os.path.join(base_dir, p))
                            if os.path.exists(target_full_path):
                                found = True
                                # Now check EXACT case
                                target_dir = os.path.dirname(target_full_path)
                                target_name = os.path.basename(target_full_path)
                                
                                # Get actual files in directory
                                try:
                                    actual_files = os.listdir(target_dir)
                                    if target_name not in actual_files:
                                        # It exists but case is wrong!
                                        actual_match = next((f for f in actual_files if f.lower() == target_name.lower()), "UNKNOWN")
                                        print(f"CASE MISMATCH in {filepath}: imported '{imp}' -> expects '{target_name}', found '{actual_match}'")
                                except FileNotFoundError:
                                    pass
                                break
                        
                        if not found:
                            print(f"NOT FOUND in {filepath}: imported '{imp}'")

if __name__ == "__main__":
    check_imports(r'c:\Users\manvi\OneDrive\Desktop\ExamverseAi\Frontend\examverse-ai\src')
