#!/bin/bash

# 公众号图片素材库快速整理脚本
# 使用方法：将图片放入 00_待整理 文件夹，然后运行此脚本

set -e

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
TEMP_DIR="$BASE_DIR/00_待整理"
TODAY=$(date +%Y-%m-%d)

echo "=== 公众号图片素材库整理脚本 ==="
echo "当前日期: $TODAY"
echo "工作目录: $BASE_DIR"
echo ""

# 检查待整理文件夹
if [ ! -d "$TEMP_DIR" ]; then
    echo "错误: 找不到 00_待整理 文件夹"
    exit 1
fi

# 统计图片数量
IMAGE_FILES=()
while IFS= read -r -d $'\0' file; do
    IMAGE_FILES+=("$file")
done < <(find "$TEMP_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" -o -iname "*.webp" \) -print0)

COUNT=${#IMAGE_FILES[@]}
if [ $COUNT -eq 0 ]; then
    echo "待整理文件夹中没有图片文件"
    echo "请将图片放入: $TEMP_DIR"
    exit 0
fi

echo "找到 $COUNT 张待整理图片"
echo ""

# 显示分类选项
echo "请选择图片分类："
echo "1) 人物人设 - 律师形象照、职业照、办公、开会、看材料"
echo "2) 办公场景 - 办公桌、电脑、文件、律所环境、会议室"
echo "3) 案件表达 - 合同、聊天记录、工资条、证据照片、法院环境"
echo "4) 生活化素材 - 喝茶、走路、看书、长沙街景、日常感受"
echo "5) 跳过，不整理"
echo ""

read -p "请输入分类编号 (1-5): " CATEGORY_CHOICE

case $CATEGORY_CHOICE in
    1)
        CATEGORY="人物人设"
        TARGET_DIR="$BASE_DIR/01_人物人设"
        ;;
    2)
        CATEGORY="办公场景"
        TARGET_DIR="$BASE_DIR/02_办公场景"
        ;;
    3)
        CATEGORY="案件表达"
        TARGET_DIR="$BASE_DIR/03_案件表达"
        ;;
    4)
        CATEGORY="生活化素材"
        TARGET_DIR="$BASE_DIR/04_生活化素材"
        ;;
    5)
        echo "跳过整理"
        exit 0
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac

echo ""
echo "分类: $CATEGORY"
echo "目标文件夹: $TARGET_DIR"
echo ""

# 询问关键词
read -p "请输入图片关键词（用下划线连接，如: 办公室看材料）: " KEYWORDS

# 清理关键词（替换空格为下划线）
CLEAN_KEYWORDS=$(echo "$KEYWORDS" | tr ' ' '_' | tr -cd '[:alnum:]_-')

if [ -z "$CLEAN_KEYWORDS" ]; then
    echo "关键词不能为空"
    exit 1
fi

# 开始整理
echo ""
echo "开始整理图片..."
echo ""

INDEX=1
for IMAGE_FILE in "${IMAGE_FILES[@]}"; do
    FILENAME=$(basename "$IMAGE_FILE")
    EXTENSION="${FILENAME##*.}"
    
    # 生成新文件名
    NEW_FILENAME="${TODAY}_${CATEGORY}_${CLEAN_KEYWORDS}_$(printf "%02d" $INDEX).${EXTENSION,,}"
    NEW_PATH="$TARGET_DIR/$NEW_FILENAME"
    
    echo "处理: $FILENAME"
    echo "  → $NEW_FILENAME"
    
    # 移动文件
    mv "$IMAGE_FILE" "$NEW_PATH"
    
    # 更新CSV登记表（如果存在）
    CSV_FILE="$BASE_DIR/素材登记表.csv"
    if [ -f "$CSV_FILE" ]; then
        # 检查是否已存在表头
        if [ ! -s "$CSV_FILE" ] || ! head -1 "$CSV_FILE" | grep -q "图片文件名"; then
            echo "图片文件名,所在文件夹,场景,用途,情绪,关键词,是否已发布,适合什么选题,备注" > "$CSV_FILE"
        fi
        
        # 添加新记录
        echo "$NEW_FILENAME,$CATEGORY,,,,,否,," >> "$CSV_FILE"
        echo "  已添加到登记表"
    fi
    
    INDEX=$((INDEX + 1))
done

echo ""
echo "=== 整理完成 ==="
echo "共整理 $((INDEX - 1)) 张图片"
echo "目标文件夹: $TARGET_DIR"
echo ""
echo "下一步："
echo "1. 打开文件夹查看图片: open \"$TARGET_DIR\""
echo "2. 编辑登记表补充详细信息"
echo "3. 在飞书多维表中同步更新"
echo ""