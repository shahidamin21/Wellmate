import { TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

type Props = {
  onPress?: () => void;
};

export function BurgerMenu({ onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
      <Icon name="menu" size={28} color="#111827" />
    </TouchableOpacity>
  );
}
