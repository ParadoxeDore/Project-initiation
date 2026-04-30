import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { GameState } from '../utils/gameEngine';

export type RootStackParamList = {
  Home: undefined;
  Setup: undefined;
  PassPhone: { gameState: GameState; playerIndex: number };
  RoleReveal: { gameState: GameState; playerIndex: number };
  Vote: { gameState: GameState };
  Result: { gameState: GameState; outcome: string };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type SetupScreenProps = NativeStackScreenProps<RootStackParamList, 'Setup'>;
export type PassPhoneScreenProps = NativeStackScreenProps<RootStackParamList, 'PassPhone'>;
export type RoleRevealScreenProps = NativeStackScreenProps<RootStackParamList, 'RoleReveal'>;
export type VoteScreenProps = NativeStackScreenProps<RootStackParamList, 'Vote'>;
export type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;
