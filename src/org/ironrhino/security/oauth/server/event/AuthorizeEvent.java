package org.ironrhino.security.oauth.server.event;

import org.ironrhino.core.event.AbstractAuditEvent;

import lombok.Getter;

public class AuthorizeEvent extends AbstractAuditEvent {

	private static final long serialVersionUID = -7010579774919637248L;

	@Getter
	private String client;

	@Getter
	private String grantType;

	public AuthorizeEvent(String username, String remoteAddr) {
		super(username, remoteAddr);
	}

	public AuthorizeEvent(String username, String remoteAddr, String clientId, String grantType) {
		super(username, remoteAddr);
		this.client = clientId;
		this.grantType = grantType;
	}

	@Override
	public String[] getArguments() {
		return new String[] { getClient(), getGrantType() };
	}

}
