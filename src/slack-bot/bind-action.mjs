import { askLunchMenu, remindOrder, commandRegister, commandDelete, handleRegisterModal, commandList } from './slack.controller.mjs';
import { OJMDefine } from './slack.define.mjs';
export async function action(event) {
    const actions = {
        [OJMDefine.LAMBDA_FUNC.ASK_LUNCH_MENU]: askLunchMenu,
        [OJMDefine.LAMBDA_FUNC.REMIND_ORDER]: remindOrder,
        [OJMDefine.LAMBDA_FUNC.COMMAND_REGISTER]: commandRegister,
        [OJMDefine.LAMBDA_FUNC.COMMAND_DELETE]: commandDelete,
        [OJMDefine.LAMBDA_FUNC.COMMAND_LIST]: commandList,
    };

    // 모달 처리
    if (event.payload) {
        const payload = JSON.parse(event.payload)
        console.log('Parsed payload:', payload);
        if (payload.type === 'view_submission') {
            return await handleRegisterModal(payload);
        }
    } else if (actions[event.type]) {
        return await actions[event.type](event);
    } else if (actions[event.command]) {
        return await actions[event.command](event);
    } else {
        console.error(`No action : ${event.type}`)
    }
}

export async function queueAction(record) {
    const actions = {
        [OJMDefine.SQS_TYPE.REGISTER]: asyncRegister,
        [OJMDefine.SQS_TYPE.GET_LIST]: asyncGetList,
        [OJMDefine.SQS_TYPE.DELETE]: asyncDelete,
    }

    const message = JSON.parse(record.body);
    if (actions[message.type]) {
        return await actions[message.type];
    } else {
        console.error(`No action : ${message.type}`)
    }
}