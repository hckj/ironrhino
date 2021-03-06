package org.ironrhino.core.util;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.temporal.Temporal;
import java.util.Date;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TypeUtils {

	public static boolean isSimple(Class<?> type) {
		if (type.isEnum())
			return true;
		if (String.class == type)
			return true;
		if ((Boolean.TYPE == type) || Boolean.class == type)
			return true;
		if ((Byte.TYPE == type) || Byte.class == type)
			return true;
		if ((Character.TYPE == type) || Character.class == type)
			return true;
		return isNumeric(type) || isTemporal(type);
	}

	public static boolean isNumeric(Class<?> type) {
		return Short.TYPE == type || Integer.TYPE == type || Long.TYPE == type || Float.TYPE == type
				|| Double.TYPE == type || (Number.class.isAssignableFrom(type));
	}

	public static boolean isIntegralNumeric(Class<?> type) {
		return Short.TYPE == type || Integer.TYPE == type || Long.TYPE == type || Short.class == type
				|| Integer.class == type || Long.class == type || BigInteger.class == type
				|| AtomicInteger.class == type || AtomicLong.class == type;
	}

	public static boolean isDecimalNumeric(Class<?> type) {
		return Float.TYPE == type || Double.TYPE == type || Float.class == type || Double.class == type
				|| BigDecimal.class.isAssignableFrom(type);
	}

	public static boolean isTemporal(Class<?> type) {
		return (Date.class.isAssignableFrom(type)) || (Temporal.class.isAssignableFrom(type));
	}

}
