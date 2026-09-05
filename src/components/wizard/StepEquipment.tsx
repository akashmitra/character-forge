import React from 'react';
import { useCharacter } from '../../state/CharacterContext';
import { DndClass } from '../../types/dnd';
import { CharacterItem } from '../../types/character';
import classesData from '../../data/classes.json';
import equipmentData from '../../data/equipment.json';
import { ParchmentCard } from '../common/ParchmentCard';
import { PHBBadge } from '../common/PHBBadge';
import { Shield, Sword, Package, Coins, Check } from 'lucide-react';

const CLASSES = classesData as DndClass[];

export const StepEquipment: React.FC = () => {
  const { character, updateCharacter, derivedStats } = useCharacter();
  const cls = CLASSES.find(c => c.id === character.classId) || CLASSES[0];

  const handleSelectOptionA = () => {
    // Generate inventory from Option A items
    const startingItems = cls.startingEquipmentOptions.optionA.items;
    const items: CharacterItem[] = startingItems.map(itemName => {
      const cleanName = itemName.replace(/\s*\(\d+\)/g, '').trim();
      const matchWeapon = equipmentData.weapons.find(w => w.name.toLowerCase() === cleanName.toLowerCase());
      const matchArmor = equipmentData.armor.find(a => a.name.toLowerCase() === cleanName.toLowerCase());
      const matchPack = equipmentData.packs.find(p => p.name.toLowerCase() === cleanName.toLowerCase());
      const matchGear = equipmentData.adventuringGear.find(g => g.name.toLowerCase() === cleanName.toLowerCase());

      const weight = matchWeapon?.weight || matchArmor?.weight || matchPack?.weight || matchGear?.weight || 2;
      const cost = matchWeapon?.costGold || matchArmor?.costGold || matchPack?.costGold || matchGear?.costGold || 5;
      const category = matchWeapon ? 'Weapon' : matchArmor ? 'Armor' : matchPack ? 'Pack' : 'Gear';

      return {
        id: 'item_' + cleanName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
        name: itemName,
        category,
        quantity: 1,
        weight,
        costGold: cost,
        equipped: !!(matchArmor || matchWeapon)
      };
    });

    const equippedArmor = equipmentData.armor.find(a =>
      startingItems.some(i => i.toLowerCase().includes(a.name.toLowerCase())) && a.category !== 'Shield'
    );
    const equippedShield = startingItems.some(i => i.toLowerCase().includes('shield')) ? 'shield' : undefined;

    updateCharacter({
      equipmentOption: 'optionA',
      inventory: items,
      equippedArmorId: equippedArmor?.id,
      equippedShieldId: equippedShield,
      gold: 15
    });
  };

  const handleSelectOptionB = () => {
    updateCharacter({
      equipmentOption: 'optionB',
      inventory: [],
      equippedArmorId: undefined,
      equippedShieldId: undefined,
      gold: cls.startingEquipmentOptions.optionBGold
    });
  };

  const handleBuyItem = (item: { name: string; costGold: number; weight: number; category: string; id: string }) => {
    if (character.gold < item.costGold) return;

    const existing = character.inventory.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    let newInv: CharacterItem[];

    if (existing) {
      newInv = character.inventory.map(i =>
        i.name.toLowerCase() === item.name.toLowerCase() ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      const isArmor = equipmentData.armor.some(a => a.id === item.id);
      newInv = [
        ...character.inventory,
        {
          id: item.id,
          name: item.name,
          category: item.category,
          quantity: 1,
          weight: item.weight,
          costGold: item.costGold,
          equipped: isArmor
        }
      ];
    }

    const isArmor = equipmentData.armor.find(a => a.id === item.id && a.category !== 'Shield');
    const isShield = item.id === 'shield';

    updateCharacter({
      inventory: newInv,
      gold: Math.max(0, parseFloat((character.gold - item.costGold).toFixed(2))),
      equippedArmorId: isArmor ? isArmor.id : character.equippedArmorId,
      equippedShieldId: isShield ? 'shield' : character.equippedShieldId
    });
  };

  const handleToggleEquip = (itemId: string) => {
    const item = character.inventory.find(i => i.id === itemId);
    if (!item) return;

    const armorMatch = equipmentData.armor.find(a => a.id === item.id || item.name.toLowerCase().includes(a.name.toLowerCase()));

    if (armorMatch) {
      if (armorMatch.category === 'Shield') {
        updateCharacter({
          equippedShieldId: character.equippedShieldId === 'shield' ? undefined : 'shield'
        });
      } else {
        updateCharacter({
          equippedArmorId: character.equippedArmorId === armorMatch.id ? undefined : armorMatch.id
        });
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-parchment tracking-wide mb-1">
          Starting Equipment &amp; Inventory
        </h2>
        <p className="text-xs font-sans text-parchment-dim">
          In 2024 D&amp;D rules, you can either take your class's curated Starting Equipment Package (Option A) or start with a lump sum of Gold to buy starting gear freely (Option B).
        </p>
      </div>

      {/* Option A vs Option B Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Option A */}
        <ParchmentCard
          selected={character.equipmentOption === 'optionA'}
          onClick={handleSelectOptionA}
          title={`Option A: ${cls.startingEquipmentOptions.optionA.name}`}
          subtitle="Curated Class Equipment Package"
          badge={<PHBBadge page={cls.phbPage} />}
        >
          <div className="space-y-3 mt-2">
            <p className="text-xs font-sans text-parchment-dark/85">
              {cls.startingEquipmentOptions.optionA.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {cls.startingEquipmentOptions.optionA.items.map((it, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-ink-pure/70 border border-parchment-border/30 text-[11px] font-sans text-parchment-light">
                  {it}
                </span>
              ))}
            </div>
            {character.equipmentOption === 'optionA' && (
              <div className="text-xs font-sans font-bold text-dnd-moss-light flex items-center gap-1">
                <Check className="w-4 h-4" /> Option A Selected
              </div>
            )}
          </div>
        </ParchmentCard>

        {/* Option B */}
        <ParchmentCard
          selected={character.equipmentOption === 'optionB'}
          onClick={handleSelectOptionB}
          title={`Option B: Starting Gold (${cls.startingEquipmentOptions.optionBGold} GP)`}
          subtitle="Custom Shop Purchase"
          badge={<Coins className="w-4 h-4 text-dnd-gold" />}
        >
          <div className="space-y-3 mt-2">
            <p className="text-xs font-sans text-parchment-dark/85">
              Forego the pre-packaged gear and begin with <strong className="text-dnd-gold">{cls.startingEquipmentOptions.optionBGold} GP</strong> in your purse to buy weapons, armor, adventuring gear, and spellcasting foci.
            </p>
            {character.equipmentOption === 'optionB' && (
              <div className="text-xs font-sans font-bold text-dnd-gold-light flex items-center gap-1">
                <Check className="w-4 h-4" /> Option B Selected — Gold: {character.gold} GP
              </div>
            )}
          </div>
        </ParchmentCard>
      </div>

      {/* Current Inventory & Weight Bar */}
      <ParchmentCard
        title="Current Inventory &amp; Equipped Gear"
        subtitle={`Total Carrying Weight: ${derivedStats.totalWeight} lbs · Current Gold: ${character.gold} GP`}
      >
        <div className="space-y-3 mt-3">
          {character.inventory.length === 0 ? (
            <p className="text-xs font-sans text-parchment-dim/70 italic py-3 text-center">
              Your backpack is currently empty. Choose an equipment option or buy items below.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {character.inventory.map((item, idx) => {
                const isEquippedArmor = character.equippedArmorId && (item.id === character.equippedArmorId || item.name.toLowerCase().includes(character.equippedArmorId));
                const isEquippedShield = character.equippedShieldId && item.name.toLowerCase().includes('shield');
                const isEquipped = isEquippedArmor || isEquippedShield;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded border text-xs font-sans flex items-center justify-between gap-2 ${
                      isEquipped
                        ? 'border-dnd-gold bg-dnd-gold/15 text-parchment'
                        : 'border-parchment-border/25 bg-ink-pure/60 text-parchment-dim'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-parchment-light block truncate">
                        {item.name} {item.quantity > 1 ? `(×${item.quantity})` : ''}
                      </span>
                      <span className="text-[10px] text-parchment-dim">
                        {item.weight * item.quantity} lb · {item.costGold * item.quantity} GP
                      </span>
                    </div>

                    {(item.category === 'Armor' || item.name.toLowerCase().includes('armor') || item.name.toLowerCase().includes('shield')) && (
                      <button
                        type="button"
                        onClick={() => handleToggleEquip(item.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                          isEquipped
                            ? 'bg-dnd-gold text-ink-pure'
                            : 'border border-parchment-border/40 text-parchment-dim hover:text-parchment'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : 'Equip'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ParchmentCard>

      {/* Equipment Store (Option B shop catalog) */}
      <ParchmentCard
        title="Merchant's Armory &amp; Equipment Catalog"
        subtitle="Purchase weapons, armor, and gear using your starting gold."
      >
        <div className="space-y-4 mt-3">
          {/* Weapons */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-dnd-gold uppercase mb-2">Weapons</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {equipmentData.weapons.slice(0, 12).map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => handleBuyItem({ name: w.name, costGold: w.costGold, weight: w.weight, category: 'Weapon', id: w.id })}
                  disabled={character.gold < w.costGold}
                  className="p-2 rounded border border-parchment-border/25 bg-ink-pure/70 hover:border-dnd-gold disabled:opacity-40 text-left text-xs font-sans transition-colors"
                >
                  <div className="font-bold text-parchment truncate">{w.name}</div>
                  <div className="text-[10px] text-dnd-gold flex justify-between">
                    <span>{w.damage} {w.damageType[0]}</span>
                    <span>{w.costGold} GP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Armor */}
          <div>
            <h4 className="font-cinzel text-xs font-bold text-dnd-gold uppercase mb-2">Armor &amp; Shields</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {equipmentData.armor.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleBuyItem({ name: a.name, costGold: a.costGold, weight: a.weight, category: 'Armor', id: a.id })}
                  disabled={character.gold < a.costGold}
                  className="p-2 rounded border border-parchment-border/25 bg-ink-pure/70 hover:border-dnd-gold disabled:opacity-40 text-left text-xs font-sans transition-colors"
                >
                  <div className="font-bold text-parchment truncate">{a.name}</div>
                  <div className="text-[10px] text-dnd-gold flex justify-between">
                    <span>AC {a.baseAC}</span>
                    <span>{a.costGold} GP</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </ParchmentCard>
    </div>
  );
};
