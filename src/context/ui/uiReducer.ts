import { UIState } from './';


type UiActionType = 
   | { type: '[UI] - ToggleMenu' } 


export const uiReducer = ( state: UIState, action: UiActionType ): UIState => {

   switch (action.type) {
      case '[UI] - ToggleMenu':
         return {
            ...state,
            isMenuOpen: !state.isMenuOpen
        }

       default:
          return state;
   }

}