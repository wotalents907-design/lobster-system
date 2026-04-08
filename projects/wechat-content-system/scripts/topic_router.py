#!/usr/bin/env python3
import sys

CLIENT_KEYWORDS = ['离职', '赔偿', '辞退', '竞业', '调岗', '降薪', '劳动纠纷', '取证', '高管']
PEER_KEYWORDS = ['律师', '获客', 'IP', '律所', '团队', '流量', '转化', '新媒体', '同行']


def score(text, keywords):
    return sum(1 for kw in keywords if kw in text)


def main():
    if len(sys.argv) < 2:
        print('用法: python topic_router.py "你的选题想法"')
        sys.exit(1)

    text = sys.argv[1]
    client_score = score(text, CLIENT_KEYWORDS)
    peer_score = score(text, PEER_KEYWORDS)

    print(f'输入: {text}')
    print(f'客户号得分: {client_score}')
    print(f'同行号得分: {peer_score}')

    if client_score > peer_score:
        print('建议归属: 客户服务号')
    elif peer_score > client_score:
        print('建议归属: 同行订阅号')
    else:
        print('建议归属: 待人工判断')


if __name__ == '__main__':
    main()
