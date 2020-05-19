import { Phase } from "../common/phase";
import { Choice } from "../common";

export class LookTroublePhase extends Phase {

    choice = Choice.create()
        .add({
            action: Choice.actions.LOOK_TROUBLE,
            handle: () => {
                
            }
        })
}