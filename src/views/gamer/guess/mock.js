


export const initTemplate1 = function(matchId){
  return [
    {
      matchId: matchId,
      guessContent: "独赢",
      sorted: 0,
      optionList: [
        {
          optionsInfo: "xxx",
          odds: 1.7,
          sorted: 0,
        },
        {
          optionsInfo: "xxx",
          odds: 2,
          sorted: 1,
        },
      ],
    },
    {
      matchId: matchId,
      guessContent: "总局数单双比分相加竞猜",
      sorted: 1,
      optionList: [
        {
          optionsInfo: "单",
          odds: 1.85,
          sorted: 0,
        },
        {
          optionsInfo: "双",
          odds: 1.85,
          sorted: 1,
        },
      ],
    },
    // {
    //   matchId: matchId,
    //   guessContent: "开球进球单双竞猜",
    //   sorted: 2,
    //   optionList: [
    //     {
    //       optionsInfo: "单",
    //       odds: 1.85,
    //       sorted: 0,
    //     },
    //     {
    //       optionsInfo: "双",
    //       odds: 1.85,
    //       sorted: 1,
    //     },
    //   ],
    // },
    {
      matchId: matchId,
      guessContent: "第一局开球进球大小竞猜",
      sorted: 3,
      optionList: [
        {
          optionsInfo: "大",
          odds: 1.85,
          sorted: 0,
        },
        {
          optionsInfo: "小",
          odds: 1.85,
          sorted: 1,
        },
      ],
    },
  ]
}