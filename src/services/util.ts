/**
 * 生成中文随机昵称 - 水果版
 * @returns 中文水果昵称，格式为"形容词+水果名"，例如"可爱的猕猴桃"、"愤怒的西瓜"
 */
export function generateChineseFruitNickname(): string {
  const adjectives = [
    '可爱的',
    '愤怒的',
    '开心的',
    '调皮的',
    '聪明的',
    '憨厚的',
    '活泼的',
    '温柔的',
    '呆萌的',
    '酷酷的',
    '优雅的',
    '傲娇的',
    '害羞的',
    '阳光的',
    '梦幻的',
    '神秘的',
    '快乐的',
    '慵懒的',
    '机灵的',
    '纯真的',
  ];

  const fruits = [
    '猕猴桃',
    '西瓜',
    '苹果',
    '香蕉',
    '橙子',
    '草莓',
    '葡萄',
    '樱桃',
    '芒果',
    '菠萝',
    '柠檬',
    '蓝莓',
    '石榴',
    '柿子',
    '荔枝',
    '龙眼',
    '桃子',
    '梨子',
    '椰子',
    '火龙果',
    '哈密瓜',
    '木瓜',
    '山竹',
    '杨桃',
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];

  return `${randomAdjective}${randomFruit}`;
}

/**
 * 生成中文随机昵称 - 动物版
 * @returns 中文动物昵称，格式为"形容词+动物名"，例如"活泼的小猫"、"威武的老虎"
 */
export function generateChineseAnimalNickname(): string {
  const adjectives = [
    '可爱的',
    '愤怒的',
    '开心的',
    '调皮的',
    '聪明的',
    '憨厚的',
    '活泼的',
    '温柔的',
    '呆萌的',
    '酷酷的',
    '优雅的',
    '傲娇的',
    '害羞的',
    '阳光的',
    '梦幻的',
    '神秘的',
    '快乐的',
    '慵懒的',
    '机灵的',
    '纯真的',
  ];

  const animals = [
    '小猫',
    '小狗',
    '小兔',
    '小熊',
    '小鹿',
    '小象',
    '小猪',
    '小羊',
    '小马',
    '小牛',
    '小鸡',
    '小鸭',
    '小鱼',
    '小鸟',
    '小猴',
    '小鼠',
    '老虎',
    '狮子',
    '熊猫',
    '狐狸',
    '松鼠',
    '刺猬',
    '袋鼠',
    '考拉',
  ];

  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective}${randomAnimal}`;
}

export function generateRandomNickName() {
  const random = Math.random();
  return random < 0.5 ? generateChineseFruitNickname() : generateChineseAnimalNickname();
}
