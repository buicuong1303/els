export const systemNotificationConfig = {
  'remind-practice-morning': {
    title: 'Hi! Yummy nhớ bạn',
    body: 'Bạn có muốn thực hành tiếng Anh ngày hôm nay không?',
    persistent: false,
  },
  'remind-practice-afternoon': {
    title: 'Hi! Yummy đây',
    body: 'Đã đến lúc dành thời gian học tiếng Anh rồi. Dành 5 phút để hoàn thành nó nào.',
    persistent: false,
  },
  'remind-practice-evening': {
    title: 'Hi! Yummy đây',
    body: 'Học một ngôn ngữ cần thực hành một chút mỗi ngày. Thực hành ngay cùng Yummy nào.',
    persistent: false,
  },
  'remind-practice-midnight': {
    title: 'Lời nhắc thực hành cùng Yummy',
    body: 'Cho đến nay, bạn đã học {{learned_words}} từ bằng tiếng Anh. Hãy dành 5 phút để học nhiều hơn.',
    persistent: false,
  },
  'remind-comeback': {
    title: 'Lâu rồi bạn không thực hành',
    body: 'Học ngay thôi.',
    persistent: false,
  },
  'congratulate-completed-topic': {
    title: 'Tuyệt vời!',
    body: 'Bạn vừa hoàn thành chủ đề <b>{{topic_name}}</b>.',
    persistent: true,
  },
  'review-request': {
    title: 'Bạn gì ơi, giúp Yummy một xíu nha',
    body: 'Click vào để đánh giá chủ đề <b>{{topic_name}}</b>',
    persistent: true,
  },
  'welcome': {
    title: 'Xin chào, mình là Yummy',
    body: 'Chào mừng bạn đã đến với Yummy, học thôi nào.',
    persistent: true,
  },
  'complain-1': {
    title: 'Hi! It\'s Yummy',
    body: 'These reminders don\'t seem to be working. We\'ll stop sending them for now',
    persistent: false,
  },
};

export enum NotificationType {
  REVIEW_REQUEST = 'review-request',
  REMIND_PRACTICE_MORNING = 'remind-practice-morning',
  REMIND_PRACTICE_AFTERNOON = 'remind-practice-afternoon',
  REMIND_PRACTICE_EVENING = 'remind-practice-evening',
  REMIND_PRACTICE_MIDNIGHT = 'remind-practice-midnight',
  REMIND_COMEBACK='remind-comeback',
  COMPLAIN_1 = 'complain-1',
  CONGRATULATE_COMPLETED_TOPIC = 'congratulate-completed-topic',
  WELCOME = 'welcome'
}


export const systemEnNotificationConfig = {
  'remind-practice-morning': {
    title: 'Hi! I miss you',
    body: 'Do you want to practice your English today',
    persistent: false,
  },
  'remind-practice-afternoon': {
    title: 'Hi! It\'s Yummy',
    body: 'It\'s time for your daily English lesson. Take 5 minutes now to complete it.',
    persistent: false,
  },
  'remind-practice-evening': {
    title: 'Hi! It\'s Yummy',
    body: 'Learning a language requires a little practice ever day. Practice your English on Yummy.',
    persistent: false,
  },
  'remind-practice-midnight': {
    title: 'Yummy practice reminder',
    body: 'You\'ve learned {{learned_words}} in English so far. Take 5 minutes now to learn more',
    persistent: false,
  },
  'remind-comeback': {
    title: 'Long time no practice',
    body: 'Let\'s study now',
    persistent: false,
  },
  'congratulate-completed-topic': {
    title: 'Congratulations!',
    body: 'You have just completed the <b>{{topic_name}}</b> topic',
    persistent: false,
  },
  'review-request': {
    title: 'Hey you, Can you do me a favor?',
    body: 'Touch here to evaluate the topic',
    persistent: true,
  },
  'complain-1': {
    title: 'Hi! It\'s Yummy',
    body: 'These reminders don\'t seem to be working. We\'ll stop sending them for now',
    persistent: false,
  },
};

