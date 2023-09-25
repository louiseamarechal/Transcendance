import NiceBox from '../ui/NiceBox';
import AchievementUserCard from './AchievementUserCard';

type Props = { achievement: { achievementName: string }[] };

function ProfileAchievements({ achievement }: Props) {
  return (
    <NiceBox title="Achievements">
      <div>
        {achievement && (
          <div className="flex-row-center flex-wrap">
            {achievement.some(
              (achievement) => achievement.achievementName === 'LOOSER',
            ) && (
              <p>
                {' '}
                <AchievementUserCard
                  image={'../../../achievements_utils/looser.png'}
                />
              </p>
            )}
            {achievement.some(
              (achievement) => achievement.achievementName === 'FIRSTVICTORY',
            ) && (
              <p>
                {' '}
                <AchievementUserCard
                  image={'../../../achievements_utils/firstVictory.png'}
                />
              </p>
            )}
            {achievement.some(
              (achievement) => achievement.achievementName === 'TENVICTORIES',
            ) && (
              <p>
                {' '}
                <AchievementUserCard
                  image={'../../../achievements_utils/tenVictories.png'}
                />
              </p>
            )}
            {achievement.some(
              (achievement) => achievement.achievementName === 'LEVEL10',
            ) && (
              <p>
                {' '}
                <AchievementUserCard
                  image={'../../../achievements_utils/level10.png'}
                />
              </p>
            )}
          </div>
        )}
      </div>
    </NiceBox>
  );
}

export default ProfileAchievements;
