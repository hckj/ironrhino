package org.ironrhino.core.hibernate.convert;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.AttributeConverter;

import org.apache.commons.lang3.StringUtils;
import org.ironrhino.core.util.ReflectionUtils;

public abstract class EnumListConverter<T extends Enum<T>> implements AttributeConverter<List<T>, String> {

	public static final String SEPARATOR = AbstractCollectionConverter.SEPARATOR;

	private Class<T> enumType;

	@SuppressWarnings("unchecked")
	public EnumListConverter() {
		Class<T> clazz = (Class<T>) ReflectionUtils.getGenericClass(getClass(), EnumListConverter.class);
		if (clazz != null)
			enumType = clazz;
	}

	@Override
	public String convertToDatabaseColumn(List<T> list) {
		if (list == null)
			return null;
		if (list.isEmpty())
			return "";
		List<String> names = new ArrayList<>();
		for (Enum<?> en : list)
			names.add(en.name());
		return String.join(SEPARATOR, names);
	}

	@Override
	public List<T> convertToEntityAttribute(String string) {
		if (string == null)
			return null;
		if (StringUtils.isBlank(string))
			return new ArrayList<>();
		String[] names = string.split(SEPARATOR);
		List<T> list = new ArrayList<>();
		for (String name : names)
			list.add(Enum.valueOf(enumType, name));
		return list;
	}

}