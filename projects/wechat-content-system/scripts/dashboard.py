#!/usr/bin/env python3
import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DATA = BASE / 'data'


def load_json(name):
    with open(DATA / name, 'r', encoding='utf-8') as f:
        return json.load(f)


def main():
    accounts = {a['id']: a for a in load_json('accounts.json')['accounts']}
    topics = load_json('topics.json')['topics']
    schedule = load_json('schedule.json')['weekPlan']

    print('=== 公众号双号内容中控台 ===')
    print()
    print('账号概览：')
    for account in accounts.values():
        count = sum(1 for t in topics if t['accountId'] == account['id'])
        print(f"- {account['name']} ({account['type']}) | 角色：{account['role']} | 选题数：{count}")

    print('\n待推进选题：')
    for topic in topics:
        if topic['status'] in {'planned', 'drafting', 'ready'}:
            print(f"- [{topic['accountId']}] {topic['title']} | {topic['pillar']} | {topic['status']} | {topic['priority']}")

    print('\n本周计划：')
    for week in schedule:
        print(f"- {week['week']}")
        for item in week['items']:
            print(f"  - {item['accountId']} / {item['topicId']} / {item['action']}")


if __name__ == '__main__':
    main()
