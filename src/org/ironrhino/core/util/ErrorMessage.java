package org.ironrhino.core.util;

import java.util.Locale;

import org.apache.commons.lang3.StringUtils;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.util.LocalizedTextUtil;

public class ErrorMessage extends RuntimeException {

	private static final long serialVersionUID = 6808322631499170777L;

	private String message;

	private Object[] args;

	private String submessage;

	public ErrorMessage(String message) {
		super(message);
		this.message = message;
	}

	public ErrorMessage(String message, Object[] args) {
		super(message);
		this.message = message;
		this.args = args;
	}

	public ErrorMessage(String message, Object[] args, String submessage) {
		super(message);
		this.message = message;
		this.args = args;
		this.submessage = submessage;
	}

	@Override
	public String getMessage() {
		return message;
	}

	@Override
	public String getLocalizedMessage() {
		Locale locale = Locale.getDefault();
		if (ActionContext.getContext() != null)
			locale = ActionContext.getContext().getLocale();
		try {
			StringBuilder sb = new StringBuilder();
			sb.append(LocalizedTextUtil.findText(ErrorMessage.class, message,
					locale, message, args));
			if (StringUtils.isNotBlank(submessage)) {
				sb.append(" : ");
				sb.append(LocalizedTextUtil.findText(ErrorMessage.class,
						submessage, locale, submessage, args));
			}
			return sb.toString();
		} catch (IllegalArgumentException e) {
			return message;
		}
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Object[] getArgs() {
		return args;
	}

	public void setArgs(Object[] args) {
		this.args = args;
	}

	public String getSubmessage() {
		return submessage;
	}

	public void setSubmessage(String submessage) {
		this.submessage = submessage;
	}

	@Override
	public Throwable fillInStackTrace() {
		return this;
	}

}
