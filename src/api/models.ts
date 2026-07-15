export interface ServerCredentials {
  ip: string;
  port: string;
  username: string;
  password: string;
}

export interface ServerMetrics {
  serverfps: number;
  currentplayernum: number;
  maxplayernum: number;
  serverframetime: number;
  uptime: number;
  basecampnum: number;
  days: number;
}

export interface Player {
  name: string;
  userId: string;
  accountName: string;
  playerId: string;
  iP: string;
  ping: number;
  location_x: number;
  location_y: number;
  level: number;
  building_count: number;
}

export interface PlayerResponse {
  players: Player[]
}

export interface ServerInfoData {
  version: string;
  servername: string;
  description: string;
  worldguid: string;
}

export interface ServerSettings {
  Difficulty: string;
  DayTimeSpeedRate: number;
  NightTimeSpeedRate: number;
  ExpRate: number;
  PalCaptureRate: number;
  PalSpawnNumRate: number;
  PalDamageRateAttack: number;
  PalDamageRateDefense: number;
  PlayerDamageRateAttack: number;
  PlayerDamageRateDefense: number;
  PlayerStomachDecreaceRate: number;
  PlayerStaminaDecreaceRate: number;
  PlayerAutoHPRegeneRate: number;
  PlayerAutoHpRegeneRateInSleep: number;
  PalStomachDecreaceRate: number;
  PalStaminaDecreaceRate: number;
  PalAutoHPRegeneRate: number;
  PalAutoHpRegeneRateInSleep: number;
  BuildObjectDamageRate: number;
  BuildObjectDeteriorationDamageRate: number;
  CollectionDropRate: number;
  CollectionObjectHpRate: number;
  CollectionObjectRespawnSpeedRate: number;
  EnemyDropItemRate: number;
  DeathPenalty: string;
  bEnablePlayerToPlayerDamage: boolean;
  bEnableFriendlyFire: boolean;
  bEnableInvaderEnemy: boolean;
  bActiveUNKO: boolean;
  bEnableAimAssistPad: boolean;
  bEnableAimAssistKeyboard: boolean;
  DropItemMaxNum: number;
  DropItemMaxNum_UNKO: number;
  BaseCampMaxNum: number;
  BaseCampWorkerMaxNum: number;
  DropItemAliveMaxHours: number;
  bAutoResetGuildNoOnlinePlayers: boolean;
  AutoResetGuildTimeNoOnlinePlayers: number;
  GuildPlayerMaxNum: number;
  PalEggDefaultHatchingTime: number;
  WorkSpeedRate: number;
  bIsMultiplay: boolean;
  bIsPvP: boolean;
  bCanPickupOtherGuildDeathPenaltyDrop: boolean;
  bEnableNonLoginPenalty: boolean;
  bEnableFastTravel: boolean;
  bIsStartLocationSelectByMap: boolean;
  bExistPlayerAfterLogout: boolean;
  bEnableDefenseOtherGuildPlayer: boolean;
  CoopPlayerMaxNum: number;
  ServerPlayerMaxNum: number;
  ServerName: string;
  ServerDescription: string;
  PublicPort: number;
  PublicIP: string;
  RCONEnabled: boolean;
  RCONPort: number;
  Region: string;
  bUseAuth: boolean;
  BanListURL: string;
  RESTAPIEnabled: boolean;
  RESTAPIPort: number;
  bShowPlayerList: boolean;
  AllowConnectPlatform: string;
  bIsUseBackupSaveData: boolean;
  LogFormatType: string;
}

export type ActorUnitType = 'Player' | 'OtomoPal' | 'BaseCampPal' | 'WildPal' | 'NPC';

export interface BaseActor {
  Type: 'Character' | 'PalBox';
  LocationX: number;
  LocationY: number;
  LocationZ: number;
  Class?: string;
  GuildID?: string;
  GuildName?: string;
}

export interface CharacterActor extends BaseActor {
  Type: 'Character';
  InstanceID?: string;
  UnitType: ActorUnitType;
  NickName?: string;
  TrainerInstanceID?: string;
  TrainerNickName?: string;
  TrainerClass?: string;
  userid?: string;
  ip?: string;
  level?: number;
  HP?: number;
  MaxHP?: number;
  Action?: string;
  AI_Action?: string;
  RotationX?: number;
  RotationY?: number;
  RotationZ?: number;
  Stage?: string;
  IsActive?: 'true' | 'false';
}

export interface PalBoxActor extends BaseActor {
  Type: 'PalBox';
}

export type PalworldActor = CharacterActor | PalBoxActor;

export interface PalworldGameDataResponse {
  Time: string;
  FPS: number;
  AverageFPS: number;
  ActorData: PalworldActor[];
}