import baseRules from '../../../../../formRules/base' // 公共规则

let makeQuestion = {
  night_shift_duty_fee: [baseRules.number],
  holiday_season_duty_fee: [baseRules.number],
  other_duty_fee: [baseRules.number],
  high_temperature_allowance_fee: [baseRules.number],

}
export {
  makeQuestion,
}
