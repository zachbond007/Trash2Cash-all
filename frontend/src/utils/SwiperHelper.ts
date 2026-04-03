import {VerificationHunt} from '../api/types';

export const getPreviouslySwipedCards = (
  verificationHunts: VerificationHunt[],
  noSelectedHuntIds: number[],
  yesSelectedHuntIds: number[],
): VerificationHunt[] => {
  const result: VerificationHunt[] = [];
  // console.log('=noSelectedHuntIds===', noSelectedHuntIds, '====');
  // console.log('=yesSelectedHuntIds===', yesSelectedHuntIds, '====');
  for (let i = 0; i < verificationHunts.length; i++) {
    const element = verificationHunts[i];
    if (yesSelectedHuntIds.includes(element.huntId)) {
      result.push({...element});
      result.push({...element});
    } else if (noSelectedHuntIds.includes(element.huntId)) {
      result.push({...element});
    }
  }
  return result;
};
