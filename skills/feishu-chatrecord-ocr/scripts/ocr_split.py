#!/usr/bin/env python3
"""
feishu-chatrecord-ocr: 微信聊天记录图片OCR识别脚本
支持超窄长图自动切分、逐条对话提取、格式化为[日期时间] 当事人/律师：内容
"""

import os
import sys
import json
import re
from pathlib import Path

try:
    from PIL import Image
    import pytesseract
except ImportError as e:
    print(f"ERROR: Missing dependency: {e}")
    print("Install with: pip install pillow pytesseract")
    sys.exit(1)


def is_narrow_image(image_path, threshold_ratio=0.2, min_height=1500):
    """判断是否为超窄长图（需要切分）"""
    try:
        with Image.open(image_path) as img:
            w, h = img.size
            ratio = w / h if h > 0 else 1
            return w < 300 and h > min_height and ratio < threshold_ratio
    except Exception:
        return False


def split_narrow_image(image_path, output_dir, chunks=3):
    """将超窄长图切分为多个区域"""
    os.makedirs(output_dir, exist_ok=True)
    chunks_list = []
    
    try:
        with Image.open(image_path) as img:
            w, h = img.size
            chunk_height = h // chunks
            
            for i in range(chunks):
                top = i * chunk_height
                bottom = (i + 1) * chunk_height if i < chunks - 1 else h
                region = img.crop((0, top, w, bottom))
                chunk_path = os.path.join(output_dir, f"chunk_{i+1}.png")
                region.save(chunk_path)
                chunks_list.append(chunk_path)
    except Exception as e:
        print(f"ERROR splitting image: {e}")
        return [image_path]
    
    return chunks_list


def extract_text_from_image(image_path):
    """从单张图片提取文字"""
    try:
        with Image.open(image_path) as img:
            text = pytesseract.image_to_string(img, lang='chi_sim+eng')
            return text
    except Exception as e:
        return f"[OCR ERROR: {e}]"


def extract_dialogue_lines(text):
    """
    从OCR文本中提取对话行。
    微信对话格式识别：时间戳 + 发言人 + 内容
    """
    lines = []
    for line in text.split('\n'):
        line = line.strip()
        if not line:
            continue
        # 跳过页眉页脚等非对话内容
        if len(line) < 3:
            continue
        lines.append(line)
    return lines


def format_dialogue(dialogue_lines):
    """
    将对话行格式化为：[日期时间] 当事人/律师：内容
    """
    formatted = []
    for line in dialogue_lines:
        # 尝试识别日期时间和发言人
        # 微信格式：2026年4月7日 10:30 或 2026/4/7 10:30
        time_pattern = r'[\d／/年月日\-\.]+[\s\d：:：]+'
        
        # 判断是律师还是当事人（简单规则：律师通常说"您"、"我方"等）
        speaker = "当事人"
        if re.search(r'(您|贵|我方|我们|律师|委托)', line):
            speaker = "律师"
        
        formatted.append(f"[未知时间] {speaker}：{line}")
    
    return formatted


def main(image_paths, output_format="text"):
    """
    主函数：处理一组聊天记录图片
    
    Args:
        image_paths: 图片路径列表
        output_format: 输出格式 (text/json)
    """
    all_dialogues = []
    
    for img_path in image_paths:
        print(f"Processing: {img_path}")
        
        # 检查是否需要切分
        if is_narrow_image(img_path):
            print(f"  → Narrow image detected, splitting...")
            chunks_dir = img_path + ".chunks"
            chunks = split_narrow_image(img_path, chunks_dir)
        else:
            chunks = [img_path]
        
        for chunk in chunks:
            text = extract_text_from_image(chunk)
            dialogue_lines = extract_dialogue_lines(text)
            formatted = format_dialogue(dialogue_lines)
            all_dialogues.extend(formatted)
    
    if output_format == "json":
        return json.dumps(all_dialogues, ensure_ascii=False, indent=2)
    else:
        return '\n'.join(all_dialogues)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python ocr_split.py <image1.png> [image2.png] ...")
        sys.exit(1)
    
    image_paths = sys.argv[1:]
    result = main(image_paths)
    print(result)
