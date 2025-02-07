use('shm-chat');
db.messages.aggregate([
  {
    $match: {
      body: {
        $regex: /паровоз+/,
      },
    },
  },
  {
    $count: 'totalSpecialMessages',
  },
]);
